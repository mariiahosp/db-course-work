import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage/LoginPage.tsx'
import { RegisterPage } from './pages/RegisterPage/RegisterPage.tsx'
import { UsersPage } from './pages/UsersPage/UsersPage.tsx'
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
          </Route>
          <Route path="*" element={<HomeRedirect />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
