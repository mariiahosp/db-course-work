import type { Product } from "../types/product";

export function toProduct(product: Product & { price: string | number }): Product {
  return { ...product, price: Number(product.price) }
}