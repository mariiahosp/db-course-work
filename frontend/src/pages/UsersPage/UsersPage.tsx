import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Table } from "../../components/Table/Table";
import { mockUsers } from "../../mocks/users";
import { useUsersStore } from "../../store/useUsersStore";
import "../ProductsPage/ProductsPage.scss";
import "./UsersPage.scss";

export const UsersPage = () => {
  const users = useUsersStore((state) => state.users)
  const error = useUsersStore((state) => state.error)
  const fetchUsers = useUsersStore((state) => state.fetchUsers)
  const navigate = useNavigate()
  const rows = users.length > 0 ? users : mockUsers

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  return (
    <section className="catalog">
      {error && users.length === 0 ? (
        <p className="users-note">Sample users are shown until the users request succeeds.</p>
      ) : null}
      <div className="table-wrapper">
        <Table
          headers={["Email", "Name", "Role", "Created At", "Updated At"]}
        >
          {rows.map(
            ({ id, email, name, role, createdAt, updatedAt }) => (
              <tr
                key={id}
                className="products__table--body--tr users-row"
                onClick={() => navigate(`/users/${id}`)}
              >
                <td className="products__table--body--tr--td">{email}</td>
                <td className="products__table--body--tr--td">{name}</td>
                <td className="products__table--body--tr--td">{role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()}</td>
                <td className="products__table--body--tr--td">
                  {new Date(createdAt).toLocaleString()}
                </td>
                <td className="products__table--body--tr--td">
                  {new Date(updatedAt).toLocaleString()}
                </td>
              </tr>
            )
          )}
        </Table>
      </div>
    </section>
  );
};
