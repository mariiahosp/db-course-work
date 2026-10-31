import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { loginSchema, type LoginFormValues } from "../auth.schema";
import "../auth-form.scss";

export const LoginPage = () => {
  const loginRequest = useAuthStore((state) => state.loginRequest);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await loginRequest(values.email, values.password);
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Failed to login",
      });
    }
  };

  return (
    <div className="register-container">
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form__item">
          <label htmlFor="login-email" className="form__label">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            className="form__input"
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email && <p className="form__field-error">{errors.email.message}</p>}
        </div>

        <div className="form__item">
          <label htmlFor="login-password" className="form__label">
            Password
          </label>
          <input
            id="login-password"
            type="password"
            className="form__input"
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p className="form__field-error">{errors.password.message}</p>
          )}
        </div>

        {errors.root && <p className="form__error">{errors.root.message}</p>}

        <button className="form__sumbit" type="submit" disabled={isSubmitting}>
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
