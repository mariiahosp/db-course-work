import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage/RegisterPage.tsx'
import { UsersPage } from './pages/UsersPage/UsersPage.tsx'
import { CategoriesPage } from './pages/CategoriesPage/CategoriesPage.tsx'
import { ProductsPage } from './pages/ProductsPage/ProductsPage.tsx'
import { OrdersPage } from './pages/OrdersPage/OrdersPage.tsx'
import { ProfilePage } from './pages/ProfilePage/ProfilePage.tsx'
import { UserProfilePage } from './pages/UserProfilePage/UserProfilePage.tsx'
import { GuestOnly, HomeRedirect, RequireAuth } from './routes/RequireAuth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomeRedirect />} />
          <Route element={<GuestOnly />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="users/:id" element={<UserProfilePage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>
          <Route path="*" element={<HomeRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
