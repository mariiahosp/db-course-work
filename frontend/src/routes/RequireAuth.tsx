import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { RoleEnum } from "../types/user";

export const RequireAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const GuestOnly = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (isAuthenticated) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
};

export const HomeRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/products" : "/login"} replace />;
};

export const RequireAdmin = () => {
  const user = useAuthStore((state) => state.user);

  if (user?.role !== RoleEnum.ADMIN) {
    return <Navigate to="/products" replace />;
  }

  return <Outlet />;
};
