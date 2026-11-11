import { Link, useParams } from "react-router-dom";
import { mockUsers } from "../../mocks/users";
import { useAuthStore } from "../../store/useAuthStore";
import { useUsersStore } from "../../store/useUsersStore";
import "../ProfilePage/ProfilePage.scss";

export const UserProfilePage = () => {
  const { id } = useParams();
  const me = useAuthStore((state) => state.user);
  const users = useUsersStore((state) => state.users);
  const listed = users.find((item) => item.id === id) ?? mockUsers.find((item) => item.id === id);
  const user = listed ?? (me?.id === id
    ? { id: me?.id, email: me?.email, name: me?.name, role: me?.role, createdAt: "", updatedAt: "" }
    : undefined);
  const isMine = Boolean(
    me && user && (me.id === user.id || me.email.toLowerCase() === user.email.toLowerCase()),
  );

  if (!user) {
    return (
      <section className="profile-page">
        <p className="profile-page__missing">User not found.</p>
        <Link to="/users" className="profile-page__back">
          Back to users
        </Link>
      </section>
    );
  }

  return (
    <section className="profile-page">
      <div className="profile-page__card">
        <div className="profile-page__heading">
          <h1 className="profile-page__title">{user.name}</h1>
          {isMine ? <span className="profile-page__badge">My profile</span> : null}
        </div>
        <div className="profile-page__row">
          <span className="profile-page__label">Email</span>
          <span>{user.email}</span>
        </div>
        <div className="profile-page__row">
          <span className="profile-page__label">Role</span>
          <span>{user.role.charAt(0) + user.role.slice(1).toLowerCase()}</span>
        </div>
        {user.createdAt ? (
          <div className="profile-page__row">
            <span className="profile-page__label">Created</span>
            <span>{new Date(user.createdAt).toLocaleString()}</span>
          </div>
        ) : null}
        {user.updatedAt ? (
          <div className="profile-page__row">
            <span className="profile-page__label">Updated</span>
            <span>{new Date(user.updatedAt).toLocaleString()}</span>
          </div>
        ) : null}
        {user.role === 'ADMIN' && (
          <Link to="/users" className="profile-page__back">
            Back to users
          </Link>
        )}
      </div>
    </section>
  );
};
