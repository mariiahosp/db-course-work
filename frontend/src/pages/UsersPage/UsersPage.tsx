import { useEffect } from "react";
import { Table } from "../../components/Table/Table";
import "./UsersPage.scss";
import { useUsersStore } from "../../store/useUsersStore";

export const UsersPage = () => {
  const users = useUsersStore((state) => state.users)
  const error = useUsersStore((state) => state.error)
  const fetchUsers = useUsersStore((state) => state.fetchUsers)

  useEffect(() => {
    void fetchUsers()
  }, [fetchUsers])

  if (error) {
    return <p>{error}</p>
  }

  return (
    <>
      <div className="table-wrapper">
        <Table
          headers={["Email", "Name", "Role", "Created At", "Updated At"]}
        >
          {users.map(
            ({ id, email, name, role, createdAt, updatedAt }) => (
              <tr key={id} className="products__table--body--tr">
                <td className="products__table--body--tr--td">{email}</td>
                <td className="products__table--body--tr--td">{name}</td>
                <td className="products__table--body--tr--td">{role.charAt(0).toUpperCase() + role.slice(1)}</td>
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
    </>
  );
};
