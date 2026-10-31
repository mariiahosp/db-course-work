import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { registerSchema, type RegisterFormValues } from "../auth.schema";
import "../auth-form.scss";

export const RegisterPage = () => {
  const registerRequest = useAuthStore((state) => state.registerRequest);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerRequest({
        name: values.name,
        email: values.email,
        password: values.password,
      });
    } catch (error) {
      setError("root", {
        message: error instanceof Error ? error.message : "Registration failed",
      });
    }
  };

  return (
    <div className="register-container">
      <form className="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form__item">
          <label htmlFor="register-name" className="form__label">
            Name
          </label>
          <input
            id="register-name"
            type="text"
            className="form__input"
            aria-invalid={errors.name ? true : undefined}
            {...register("name")}
          />
          {errors.name && <p className="form__field-error">{errors.name.message}</p>}
        </div>

        <div className="form__item">
          <label htmlFor="register-email" className="form__label">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            className="form__input"
            aria-invalid={errors.email ? true : undefined}
            {...register("email")}
          />
          {errors.email && <p className="form__field-error">{errors.email.message}</p>}
        </div>

        <div className="form__item">
          <label htmlFor="register-password" className="form__label">
            Password
          </label>
          <input
            id="register-password"
            type="password"
            className="form__input"
            aria-invalid={errors.password ? true : undefined}
            {...register("password")}
          />
          {errors.password && (
            <p className="form__field-error">{errors.password.message}</p>
          )}
        </div>

        <div className="form__item">
          <label htmlFor="register-confirm-password" className="form__label">
            Confirm Password
          </label>
          <input
            id="register-confirm-password"
            type="password"
            className="form__input"
            aria-invalid={errors.confirmPassword ? true : undefined}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="form__field-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        {errors.root && <p className="form__error">{errors.root.message}</p>}

        <button className="form__sumbit" type="submit" disabled={isSubmitting}>
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
