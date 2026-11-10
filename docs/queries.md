# Запити

## Прості вибірки

Список товарів фільтрує рядки за категорією і пошуковим рядком, сортує за ціною і повертає сторінку через `LIMIT`/`OFFSET`. Разом із товаром читається категорія, тож це вибірка з `JOIN`.

`GET /api/products?categoryId=<uuid>&search=phone&priceOrder=desc&limit=20&offset=0`

Список користувачів фільтрує активні облікові записи за роллю, частиною імені або пошти і датою створення, теж зі сторінками.

`GET /api/users?role=CUSTOMER&search=anna&createdAfter=2024-01-01&limit=20&offset=0`

Видалені користувачі, у яких заповнений `deleted_at`, у цей список не входять.

## Запит 1. Місячний дохід за категоріями

Бізнес-питання: скільки доходу принесла кожна категорія за кожен місяць, і які категорії перевищили заданий поріг?

Маршрут: `GET /api/reports/revenue?minRevenue=1000`. Доступ лише в адміністратора. Якщо `minRevenue` не передали, поріг дорівнює `0`.

SQL-запит:

```sql
SELECT
  c.name AS category,
  DATE_TRUNC('month', o.created_at) AS month,
  COUNT(DISTINCT o.id)::int AS order_count,
  SUM(oi.quantity * oi.unit_price)::float AS total_revenue
FROM orders AS o
JOIN order_items AS oi
  ON oi.order_id = o.id
JOIN products AS p
  ON p.id = oi.product_id
JOIN categories AS c
  ON c.id = p.category_id
WHERE o.status = 'DELIVERED'::"OrderStatus"
GROUP BY c.name, DATE_TRUNC('month', o.created_at)
HAVING SUM(oi.quantity * oi.unit_price) > $1
ORDER BY month DESC, total_revenue DESC;
```

`$1` — значення `minRevenue`. Prisma передає його параметром у `$queryRaw`.

Пояснення:

- `orders`, `order_items`, `products` і `categories` з’єднуються чотирма таблицями, щоб від позиції дійти до назви категорії.
- У суму входять лише доставлені замовлення. `PLACED`, `IN_TRANSIT` і `CANCELLED` відсікає `WHERE`.
- Дохід рахується як `quantity * unit_price`. `unit_price` — ціна на момент покупки, тому пізніша зміна ціни товару не змінює звіт.
- `DATE_TRUNC('month', o.created_at)` збирає всі замовлення календарного місяця в одну групу.
- `GROUP BY` будує групу «категорія + місяць».
- `COUNT(DISTINCT o.id)` рахує замовлення один раз, навіть якщо в ньому кілька позицій однієї категорії.
- `SUM` додає гроші всіх позицій групи.
- `HAVING` застосовується вже до порахованої суми і прибирає групи, які не перевищили поріг.
- Свіжіші місяці йдуть першими. Усередині місяця першими йдуть категорії з більшим доходом.

Приклад виводу:

| category | month | orderCount | totalRevenue |
|----------|-------|------------|--------------|
| Ноутбуки | 2026-11-01 | 4 | 3200.00 |
| Навушники | 2026-11-01 | 6 | 1450.50 |
| Ноутбуки | 2026-10-01 | 2 | 1800.00 |

Група з доходом нижче `minRevenue` у відповіді відсутня. Місяць у відповіді — перший день цього місяця, бо так працює `DATE_TRUNC`.
