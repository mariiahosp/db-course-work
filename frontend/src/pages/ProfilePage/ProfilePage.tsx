import { useAuthStore } from "../../store/useAuthStore";
import "./ProfilePage.scss";

export const ProfilePage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="profile-page">
      <div className="profile-page__card">
        <h1 className="profile-page__title">My Profile</h1>
        <div className="profile-page__row">
          <span className="profile-page__label">Name</span>
          <span>{user?.name ?? "Anna Kovalska"}</span>
        </div>
        <div className="profile-page__row">
          <span className="profile-page__label">Email</span>
          <span>{user?.email ?? "anna@example.com"}</span>
        </div>
        <div className="profile-page__row">
          <span className="profile-page__label">Role</span>
          <span>{user?.role ?? "CUSTOMER"}</span>
        </div>
      </div>
    </section>
  );
};
