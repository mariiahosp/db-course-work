# Магазин техніки

Бекенд інтернет-магазину техніки. Проєкт зберігає користувачів, категорії, товари, замовлення з позиціями й оплатою та історію зміни цін. Схема в третій нормальній формі. Складні зміни даних проходять у транзакціях.

Індивідуальна робота. Автор: Maria.

## Стек

- Node.js 22
- TypeScript
- NestJS 11
- Prisma 7 і PostgreSQL 17
- Jest для тестів
- React і Vite для інтерфейсу

## Запуск через Docker

Потрібен Docker Desktop. У корені репозиторію:

```bash
docker compose up --build
```

Compose піднімає PostgreSQL і бекенд. Бекенд сам застосовує міграції і слухає порт `3031`. Перевірка:

```bash
curl http://127.0.0.1:3031/api
```

База доступна і з хоста, тож pgAdmin підключається так:

| Поле | Значення |
|------|----------|
| Host | `127.0.0.1` |
| Port | `5432` |
| Database | `coursework` |
| Username | `postgres` |
| Password | `postgres` |

Дані Postgres лежать у volume `postgres_data` і зберігаються між перезапусками.

Секрети JWT можна перевизначити перед запуском:

```bash
export JWT_ACCESS_SECRET="свій-секрет"
export JWT_REFRESH_SECRET="свій-інший-секрет"
docker compose up --build
```

Без цих змінних Compose підставляє навчальні значення з `docker-compose.yml`.

## Локальний запуск без контейнера бекенду

Так зручно розробляти з перезапуском після кожної зміни. База лишається в Docker, бекенд запускається на хості.

```bash
docker compose up -d postgres
cd backend
cp .env.example .env
npm install
npx prisma migrate deploy
npx prisma generate
npm run start:dev
```

У `.env` хост бази має бути `127.0.0.1`, не ім’я сервісу `postgres`. Приклад є в `backend/.env.example`.

Інтерфейс:

```bash
cd frontend
npm install
npm run dev
```

Vite відкривається на `http://127.0.0.1:5173` і проксує `/api` на `http://127.0.0.1:3031`.

## Основні маршрути

Усі маршрути мають префікс `/api`. Крім реєстрації, входу, оновлення токена й виходу, потрібен заголовок `Authorization: Bearer <accessToken>`.

Реєстрація покупця:

```bash
curl -X POST http://127.0.0.1:3031/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Anna","email":"anna@example.com","password":"secret1"}'
```

Відповідь містить `accessToken`, `refreshToken` і дані користувача. Роль за замовчуванням — `CUSTOMER`. Адміністратора можна створити через `POST /api/users` з `"role": "ADMIN"`.

Створення замовлення списує залишок, записує позиції з ціною на момент покупки і створює оплату `PENDING` в одній транзакції:

```bash
curl -X POST http://127.0.0.1:3031/api/orders \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"items":[{"productId":"<uuid>","quantity":2}]}'
```

Зміна ціни доступна лише адміністратору. `version` береться з поточного товару. Повтор зі старим номером повертає `409`, а в `price_history` лишається лише успішна зміна:

```bash
curl -X PATCH http://127.0.0.1:3031/api/products/<uuid> \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"price":199.99,"version":1}'
```

Місячний дохід за категоріями рахує лише доставлені замовлення:

```bash
curl "http://127.0.0.1:3031/api/reports/revenue?minRevenue=1000" \
  -H "Authorization: Bearer $ACCESS_TOKEN"
```

Інші групи маршрутів: `/api/users`, `/api/categories`, `/api/products`, `/api/orders`. Опис таблиць є в [docs/schema.md](docs/schema.md), розбір звіту — в [docs/queries.md](docs/queries.md).

## Тести

З папки `backend`:

```bash
npm test
npm run test:e2e
```

## Структура

```
docker-compose.yml
Dockerfile
backend/          NestJS, Prisma, міграції
frontend/         інтерфейс на Vite
docs/schema.md    таблиці, зв’язки, індекси
docs/queries.md   аналітичний запит
```
