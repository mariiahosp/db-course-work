import { useEffect, useState } from "react";
import PencilIcon from "../../assets/pencilIcon.svg?react";
import { Dropdown } from "../../components/DropDown/DropDown";
import { Input } from "../../components/Input/Input";
import { Modal } from "../../components/Modal/Modal";
import { Table } from "../../components/Table/Table";
import { useAuthStore } from "../../store/useAuthStore";
import { useOrdersStore } from "../../store/useOrdersStore";
import type { Order } from "../../types/order";
import { RoleEnum } from "../../types/user";
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

const nextDelivery: Record<Order["status"], Order["status"][]> = {
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
  const [editing, setEditing] = useState<Order | null>(null);
  const [delivery, setDelivery] = useState<Order["status"]>("PLACED");
  const [formError, setFormError] = useState("");

  const items = useOrdersStore((state) => state.orders);
  const error = useOrdersStore((state) => state.error);
  const fetchOrders = useOrdersStore((state) => state.fetchOrders);
  const updateStatus = useOrdersStore((state) => state.updateStatus);
  const removeOrder = useOrdersStore((state) => state.remove);

  const visibleOrders = items.filter((order) => {
    const matchesQuery = order.user.email.toLowerCase().includes(query.trim().toLowerCase());
    const matchesStatus = status === "all" || order.status === status;
    const matchesPayment = payment === "all" || order.payment?.status === payment;
    return matchesQuery && matchesStatus && matchesPayment;
  });

  const openEdit = (order: Order) => {
    setEditing(order);
    setDelivery(order.status);
    setFormError("");
  };

  const closeEdit = () => {
    setEditing(null);
    setFormError("");
  };

  const saveOrder = async () => {
    if (!editing) {
      return;
    }

    if (delivery === editing.status) {
      closeEdit();
      return;
    }

    try {
      await updateStatus(editing.id, delivery, editing.version);
      closeEdit();
    } catch (saveError) {
      setFormError(saveError instanceof Error ? saveError.message : "Request failed");
    }
  };

  const deleteOrder = async () => {
    if (!editing) return;
    try {
      await removeOrder(editing.id);
      closeEdit();
    } catch (deleteError) {
      setFormError(deleteError instanceof Error ? deleteError.message : "Request failed");
    }
  };

  const deliveryChoices = editing ? [editing.status, ...nextDelivery[editing.status]] : [];
  const canDelete = editing?.status === "CANCELLED" && editing.payment?.status === "PENDING";

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

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

      {error ? <p className="catalog__empty">{error}</p> : visibleOrders.length === 0 ? (
        <p className="catalog__empty">No Orders</p>
      ) : (
        <div className="table-wrapper">
          <Table headers={isAdmin ? ["ID", "Customer", "Delivery", "Payment", "Total", "Created", ""] : ["ID", "Customer", "Delivery", "Payment", "Total", "Created"]}>
            {visibleOrders.map((order) => (
              <tr key={order.id} className="products__table--body--tr">
                <td className="products__table--body--tr--td">{order.id}</td>
                <td className="products__table--body--tr--td">{order.user.email}</td>
                <td className="products__table--body--tr--td">{statusLabel[order.status]}</td>
                <td className="products__table--body--tr--td">{statusLabel[order.payment?.status ?? ""]}</td>
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
        <Modal title={`Order ${editing.id}`} onClose={closeEdit}>
          <form
            className="modal__form"
            onSubmit={(event) => {
              event.preventDefault();
              void saveOrder();
            }}
          >
            <label className="modal__field">
              Delivery
              <select
                className="modal__select"
                value={delivery}
                onChange={(event) => setDelivery(event.target.value as Order["status"])}
              >
                {deliveryChoices.map((value) => (
                  <option key={value} value={value}>
                    {statusLabel[value]}
                  </option>
                ))}
              </select>
            </label>
            <label className="modal__field">
              Payment
              <input className="modal__input" value={statusLabel[editing.payment?.status ?? ""] ?? ""} readOnly />
            </label>
            {formError ? <p className="modal__error">{formError}</p> : null}
            <div className="modal__actions">
              {canDelete ? (
                <button type="button" className="modal__cancel" onClick={() => void deleteOrder()}>
                  Delete
                </button>
              ) : null}
              <button type="button" className="modal__cancel" onClick={closeEdit}>
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
