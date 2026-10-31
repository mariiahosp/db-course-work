import { NavLink } from "react-router-dom";
import "../auth-form.scss";
import { useAuthStore } from "../../store/useAuthStore";
import { useState, type FormEvent } from "react";

export const RegisterPage = () => {
  const registerRequest = useAuthStore((state) => state.registerRequest);
  const [error, setError] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password"));
    const confirmPassword = String(form.get("confirmPassword"));

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await registerRequest({
        name: String(form.get("name")),
        email: String(form.get("email")),
        phone: String(form.get("phone")),
        password,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <form
        className="form"
        onSubmit={onSubmit}
      >
        <div className="form__item">
          <label htmlFor="register-name" className="form__label">
            Name
          </label>
          <input id="register-name" name="name" type="text" className="form__input" />
        </div>

        <div className="form__item">
          <label htmlFor="register-email" className="form__label">
            Email
          </label>
          <input id="register-email" name="email" type="email" className="form__input" />
        </div>

        <div className="form__item">
          <label htmlFor="register-phone" className="form__label">
            Phone
          </label>
          <input id="register-phone" name="phone" type="text" className="form__input" />
        </div>

        <div className="form__item">
          <label htmlFor="register-password" className="form__label">
            Password
          </label>
          <input
            id="register-password"
            name="password"
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
            name="confirmPassword"
            type="password"
            className="form__input"
          />
        </div>

        {error && <p className="form__error">{error}</p>}

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
