import { NavLink } from "react-router-dom";
import "../auth-form.scss";

export const LoginPage = () => {
  return (
    <div className="register-container">
      <form
        className="form"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="form__item">
          <label htmlFor="login-email" className="form__label">
            Email
          </label>
          <input id="login-email" type="email" className="form__input" />
        </div>

        <div className="form__item">
          <label htmlFor="login-password" className="form__label">
            Password
          </label>
          <input id="login-password" type="password" className="form__input" />
        </div>

        <button className="form__sumbit" type="submit">
          Login
        </button>

        <p className="form__login">
          Or{" "}
          <NavLink to="/register" className="form__login--blue">
            Register
          </NavLink>
        </p>
      </form>
    </div>
  );
};
