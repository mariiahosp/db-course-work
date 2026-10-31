import { NavLink } from "react-router-dom";
import "../auth-form.scss";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, type FormEvent } from "react";

export const LoginPage = () => {
  const loginRequest = useAuthStore((state) => state.loginRequest);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      await loginRequest(String(form.get('email')), String(form.get('password')));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to login');
    }
  }
  return (
    <div className="register-container">
      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form__item">
          <label htmlFor="login-email" className="form__label">
            Email
          </label>
          <input id="login-email" name="email" type="email" className="form__input" />
        </div>

        <div className="form__item">
          <label htmlFor="login-password" className="form__label">
            Password
          </label>
          <input id="login-password" name="password" type="password" className="form__input" />
        </div>

        {error && <p className="form__error">{error}</p>}

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
