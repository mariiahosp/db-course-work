import { create } from "zustand";
import {
  categories as seedCategories,
  products as seedProducts,
  type CatalogCategory,
  type CatalogProduct,
} from "../mocks/catalog";

type CatalogState = {
  categories: CatalogCategory[];
  products: CatalogProduct[];
  upsertProduct: (product: CatalogProduct) => void;
  upsertCategory: (category: CatalogCategory) => void;
};

export const useCatalogStore = create<CatalogState>((set) => ({
  categories: seedCategories,
  products: seedProducts,
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
