import { NavLink } from "react-router-dom";
import "../auth-form.scss";

export const RegisterPage = () => {
  return (
    <div className="register-container">
      <form
        className="form"
        onSubmit={(event) => event.preventDefault()}
      >
        <div className="form__item">
          <label htmlFor="register-name" className="form__label">
            Name
          </label>
          <input id="register-name" type="text" className="form__input" />
        </div>

        <div className="form__item">
          <label htmlFor="register-email" className="form__label">
            Email
          </label>
          <input id="register-email" type="email" className="form__input" />
        </div>

        <div className="form__item">
          <label htmlFor="register-phone" className="form__label">
            Phone
          </label>
          <input id="register-phone" type="text" className="form__input" />
        </div>

        <div className="form__item">
          <label htmlFor="register-password" className="form__label">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            className="form__input"
          />
        </div>

        <div className="form__item">
          <label htmlFor="register-confirm-password" className="form__label">
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            type="password"
            className="form__input"
          />
        </div>

        <button className="form__sumbit" type="submit">
          Register
        </button>

        <p className="form__login">
          Or{" "}
          <NavLink to="/login" className="form__login--blue">
            Login
          </NavLink>
        </p>
      </form>
    </div>
  );
};
