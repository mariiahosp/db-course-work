import { useState } from "react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { Dropdown } from "../../components/DropDown/DropDown";
import { Input } from "../../components/Input/Input";
import { Table } from "../../components/Table/Table";
import { orders } from "../../mocks/catalog";
import "../ProductsPage/ProductsPage.scss";

const statusLabel: Record<string, string> = {
  PLACED: "Placed",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

export const OrdersPage = () => {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");

  const visibleOrders = orders.filter((order) => {
    const matchesQuery = order.customer.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = status === "all" || order.status === status;
    const matchesPayment = payment === "all" || order.paymentStatus === payment;
    return matchesQuery && matchesStatus && matchesPayment;
  });

  return (
    <section className="catalog">
      <div className="catalog__head">
        <Input query={query} setQuery={setQuery} placeholder="Type customer email" />
        <Dropdown
          label="Delivery"
          onSelect={setStatus}
          items={[
            { label: "All", value: "all" },
            { label: "Placed", value: "PLACED" },
            { label: "In Transit", value: "IN_TRANSIT" },
            { label: "Delivered", value: "DELIVERED" },
            { label: "Cancelled", value: "CANCELLED" },
          ]}
        />
        <Dropdown
          label="Payment"
          onSelect={setPayment}
          items={[
            { label: "All", value: "all" },
            { label: "Pending", value: "PENDING" },
            { label: "Paid", value: "PAID" },
            { label: "Failed", value: "FAILED" },
          ]}
        />
      </div>

      {visibleOrders.length === 0 ? (
        <p className="catalog__empty">No Orders</p>
      ) : (
        <div className="table-wrapper">
          <Table headers={["ID", "Customer", "Delivery", "Payment", "Total", "Created", ""]}>
            {visibleOrders.map((order) => (
              <tr key={order.id} className="products__table--body--tr">
                <td className="products__table--body--tr--td">{order.id}</td>
                <td className="products__table--body--tr--td">{order.customer}</td>
                <td className="products__table--body--tr--td">{statusLabel[order.status]}</td>
                <td className="products__table--body--tr--td">{statusLabel[order.paymentStatus]}</td>
                <td className="products__table--body--tr--td">${order.totalAmount}</td>
                <td className="products__table--body--tr--td">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="products__table--body--tr--td">
                  <button type="button" className="edit-btn" aria-label={`Edit order ${order.id}`}>
                    <PencilIcon className="edit-btn--svg" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      )}
    </section>
  );
};
