import { useState } from "react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { Dropdown } from "../../components/DropDown/DropDown";
import { Input } from "../../components/Input/Input";
import { Modal } from "../../components/Modal/Modal";
import { Table } from "../../components/Table/Table";
import { orders as seedOrders } from "../../mocks/catalog";
import { useAuthStore } from "../../store/useAuthStore";
import { RoleEnum } from "../../types/user";
import "../ProductsPage/ProductsPage.scss";

type Order = (typeof seedOrders)[number];

const statusLabel: Record<string, string> = {
  PLACED: "Placed",
  IN_TRANSIT: "In Transit",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  PENDING: "Pending",
  PAID: "Paid",
  FAILED: "Failed",
};

const nextDelivery: Record<string, string[]> = {
  PLACED: ["IN_TRANSIT", "CANCELLED"],
  IN_TRANSIT: ["DELIVERED", "CANCELLED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const OrdersPage = () => {
  const isAdmin = useAuthStore((state) => state.user?.role === RoleEnum.ADMIN);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [payment, setPayment] = useState("all");
  const [items, setItems] = useState<Order[]>(seedOrders);
  const [editing, setEditing] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const visibleOrders = items.filter((order) => {
    const matchesQuery = order.customer.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = status === "all" || order.status === status;
    const matchesPayment = payment === "all" || order.paymentStatus === payment;
    return matchesQuery && matchesStatus && matchesPayment;
  });

  const openEdit = (order: Order) => {
    setEditing(order);
    setDelivery(order.status);
    setPaymentStatus(order.paymentStatus);
  };

  const saveOrder = () => {
    if (!editing) {
      return;
    }

    setItems((current) =>
      current.map((order) =>
        order.id === editing.id ? { ...order, status: delivery, paymentStatus } : order,
      ),
    );
    setEditing(null);
  };

  const deliveryChoices = editing ? [editing.status, ...nextDelivery[editing.status]] : [];

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
          <Table headers={isAdmin ? ["ID", "Customer", "Delivery", "Payment", "Total", "Created", ""] : ["ID", "Customer", "Delivery", "Payment", "Total", "Created"]}>
            {visibleOrders.map((order) => (
              <tr key={order.id} className="products__table--body--tr">
                <td className="products__table--body--tr--td">{order.id}</td>
                <td className="products__table--body--tr--td">{order.customer}</td>
                <td className="products__table--body--tr--td">{statusLabel[order.status]}</td>
                <td className="products__table--body--tr--td">{statusLabel[order.paymentStatus]}</td>
                <td className="products__table--body--tr--td">${order.totalAmount}</td>
                <td className="products__table--body--tr--td">{new Date(order.createdAt).toLocaleDateString()}</td>
                {isAdmin ? (
                  <td className="products__table--body--tr--td">
                    <button type="button" className="edit-btn" aria-label={`Edit order ${order.id}`} onClick={() => openEdit(order)}>
                      <PencilIcon className="edit-btn--svg" />
                    </button>
                  </td>
                ) : null}
              </tr>
            ))}
          </Table>
        </div>
      )}

      {editing ? (
        <Modal title={`Order ${editing.id}`} onClose={() => setEditing(null)}>
          <form
            className="modal__form"
            onSubmit={(event) => {
              event.preventDefault();
              saveOrder();
            }}
          >
            <label className="modal__field">
              Delivery
              <select className="modal__select" value={delivery} onChange={(event) => setDelivery(event.target.value)}>
                {deliveryChoices.map((value) => (
                  <option key={value} value={value}>
                    {statusLabel[value]}
                  </option>
                ))}
              </select>
            </label>
            <label className="modal__field">
              Payment
              <select className="modal__select" value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
                {["PENDING", "PAID", "FAILED"].map((value) => (
                  <option key={value} value={value}>
                    {statusLabel[value]}
                  </option>
                ))}
              </select>
            </label>
            <div className="modal__actions">
              <button type="button" className="modal__cancel" onClick={() => setEditing(null)}>
                Cancel
              </button>
              <button type="submit" className="modal__save">
                Save
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </section>
  );
};
