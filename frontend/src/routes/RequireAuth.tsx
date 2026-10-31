import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export const RequireAuth = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export const GuestOnly = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
console.log('isAuthenticated', isAuthenticated)
  if (isAuthenticated) {
    return <Navigate to="/users" replace />;
  }

  return <Outlet />;
};

export const HomeRedirect = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Navigate to={isAuthenticated ? "/users" : "/login"} replace />;
};
