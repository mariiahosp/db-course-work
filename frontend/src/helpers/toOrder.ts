import type { Order } from "../types/order";

export function toOrder(order: Order & { totalAmount: string | number }): Order {
  return { ...order, totalAmount: Number(order.totalAmount) }
}