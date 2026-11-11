import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { useUsersStore } from "../../store/useUsersStore";
import "../ProfilePage/ProfilePage.scss";

export const UserProfilePage = () => {
  const { id } = useParams();
  const me = useAuthStore((state) => state.user);
  const selectedUser = useUsersStore((state) => state.selectedUser);
  const error = useUsersStore((state) => state.error);
  const fetchUser = useUsersStore((state) => state.fetchUser);
  const user = selectedUser?.id === id ? selectedUser : undefined;

  useEffect(() => {
    if (!id) return;
    void fetchUser(id);
  }, [id, fetchUser]);
  const isMine = Boolean(
    me && user && (me.id === user.id || me.email.toLowerCase() === user.email.toLowerCase()),
  );

  if (!user) {
    return (
      <section className="profile-page">
        <p className="profile-page__missing">{error || "Loading..."}</p>
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
