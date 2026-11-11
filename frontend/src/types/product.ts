export type Product = {
  id: string
  categoryId: string
  sku: string
  name: string
  description: string
  price: number
  stock: number
  isActive: boolean
  version: number
  imageUrl: string | null
  category: { id: string; name: string; slug: string }
}

export type Page<T> = { data: T[]; total: number; limit: number; offset: number }