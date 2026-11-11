import { create } from "zustand";
import { api } from "../api";
import { readError } from "../helpers/readError";
import type { Page, Product } from "../types/product";
import type { Category } from "../types/category";
import { toProduct } from "../helpers/toProduct";

type CatalogState = {
  categories: Category[];
  products: Product[];
  loading: boolean;
  error: string | null;
  fetchCategories: (limit: number, offset: number) => Promise<void>;
  fetchProducts: (limit: number, offset: number) => Promise<void>;
  fetchCategory: (id: string) => Promise<void>;
  fetchProduct: (id: string) => Promise<void>
  saveCategory: (draft: { id?: string; name: string; slug: string; imageUrl?: string }) => Promise<void>
  saveProduct: (draft: {
    id?: string
    categoryId: string
    sku: string
    name: string
    description: string
    price: number
    stock: number
    isActive: boolean
    imageUrl?: string
    version?: number
  }) => Promise<void>
  changePrice: (id: string, price: number, version: number) => Promise<void>
  upsertProduct: (product: Product) => void;
  upsertCategory: (category: Category) => void;
};

export const useCatalogStore = create<CatalogState>((set, get) => ({
  categories: [],
  products: [],
  loading: false,
  error: null,
  fetchCategories: async (limit, offset) => {
    set({ loading: true, error: null })
    try {
      const response = await api(`/api/categories?limit=${limit}&offset=${offset}`)
      if (!response.ok) throw new Error(await readError(response))
      const body = (await response.json()) as Page<Category>
      set({ categories: body.data, loading: false })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Request failed' })
    }
  },
  fetchProducts: async (limit: number, offset: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api(`/api/products?limit=${limit}&offset=${offset}`);
      if (!response.ok) throw new Error(await readError(response))
      const body = (await response.json()) as Page<Product & { price: string | number }>
      set({ products: body.data.map(toProduct), loading: false });
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'An unknown error occurred' });
    }
  },
  fetchCategory: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await api(`/api/categories/${id}`)
      if (!response.ok) throw new Error(await readError(response))
      const category = (await response.json()) as Category
      get().upsertCategory(category)
      set({ loading: false })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Request failed' })
    }
  },
  fetchProduct: async (id) => {
    set({ loading: true, error: null })
    try {
      const response = await api(`/api/products/${id}`)
      if (!response.ok) throw new Error(await readError(response))
      const product = (await response.json()) as Product & { price: string | number }
      get().upsertProduct(toProduct(product))
      set({ loading: false })
    } catch (error) {
      set({ loading: false, error: error instanceof Error ? error.message : 'Request failed' })
    }
  },
  saveCategory: async (draft) => {
    const path = draft.id ? `/api/categories/${draft.id}` : '/api/categories'
    const response = await api(path, {
      method: draft.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: draft.name,
        slug: draft.slug,
        ...(draft.imageUrl ? { imageUrl: draft.imageUrl } : {}),
      }),
    })
    if (!response.ok) throw new Error(await readError(response))
    const category = (await response.json()) as Category
    get().upsertCategory(category)
  },
  saveProduct: async (draft) => {
    const path = draft.id ? `/api/products/${draft.id}` : '/api/products'
    const response = await api(path, {
      method: draft.id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        categoryId: draft.categoryId,
        sku: draft.sku,
        name: draft.name,
        description: draft.description,
        stock: draft.stock,
        isActive: draft.isActive,
        ...(draft.imageUrl ? { imageUrl: draft.imageUrl } : {}),
        ...(draft.id ? {} : { price: draft.price }),
      }),
    })
    if (!response.ok) throw new Error(await readError(response))
    const saved = toProduct((await response.json()) as Product & { price: string | number })
    if (draft.id && draft.version !== undefined && draft.price !== saved.price) {
      await get().changePrice(draft.id, draft.price, draft.version)
      return
    }
    get().upsertProduct(saved)
  },
  changePrice: async (id, price, version) => {
    const response = await api(`/api/products/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price, version }),
    })
    if (!response.ok) throw new Error(await readError(response))
    const product = toProduct((await response.json()) as Product & { price: string | number })
    get().upsertProduct(product)
  },
  upsertProduct: (product) =>
    set((state) => ({
      products: state.products.some((item) => item.id === product.id)
        ? state.products.map((item) => (item.id === product.id ? product : item))
        : [product, ...state.products],
    })),
  upsertCategory: (category) =>
    set((state) => ({
      categories: state.categories.some((item) => item.id === category.id)
        ? state.categories.map((item) => (item.id === category.id ? category : item))
        : [category, ...state.categories],
    })),
}));
