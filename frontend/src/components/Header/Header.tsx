import "./Header.scss";
import HeaderIcon from "../../assets/headerIcon.svg?react";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

export const Header = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <>
      <header className="header">
        <div className="header__logo">
          <HeaderIcon width={43} height={38} />
          <p className="header__logo--title">Awesome Store</p>
        </div>

        {isAuthenticated ? (
          <div className="header__list">
          <NavLink 
            to='/users' 
            className={({ isActive }) => (isActive ? 'header__list--link active-link' : 'header__list--link')}
          >
            Users
          </NavLink>
          <NavLink
            to="/categories"
            className={({ isActive }) => (isActive ? "header__list--link active-link" : "header__list--link")}
          >
            Categories
          </NavLink>
          <NavLink 
            to='/products' 
            className={({ isActive }) => (isActive ? 'header__list--link active-link' : 'header__list--link')}
          >
            Products
          </NavLink>
          <NavLink 
            to='/orders' 
            className={({ isActive }) => (isActive ? 'header__list--link active-link' : 'header__list--link')}
          >
            Orders
            </NavLink>
            <p className="header__list--link" onClick={() => void logout()}>Logout</p>
          <NavLink 
            to={user ? `/users/${user.id}` : "/profile"} 
            className={({ isActive }) => (isActive ? 'header__list--link active-link profile active-profile' : 'header__list--link profile')}
          >
            My Profile
          </NavLink>
        </div>
        ) : (
          <div className="header__list">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? "header__list--link active-link" : "header__list--link")}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) => (isActive ? "header__list--link active-link" : "header__list--link")}
            >
              Register
            </NavLink>
          </div>
        )}
      </header>
    </>
  );
};
