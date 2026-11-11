export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export const categories: CatalogCategory[] = [
  { id: "cat-laptops", name: "Laptops", slug: "laptops", imageUrl: "https://picsum.photos/seed/laptops/640/480" },
  { id: "cat-phones", name: "Phones", slug: "phones", imageUrl: "https://picsum.photos/seed/phones/640/480" },
  { id: "cat-audio", name: "Audio", slug: "audio", imageUrl: null },
];

export type CatalogProduct = {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string | null;
};

export const products: CatalogProduct[] = [
  {
    id: "prod-mbp",
    sku: "MBP-14-M3",
    name: "MacBook Pro 14",
    description: "14-inch laptop with the M3 chip",
    category: "Laptops",
    price: 1999,
    stock: 12,
    isActive: true,
    imageUrl: "https://picsum.photos/seed/macbook/640/480",
  },
  {
    id: "prod-air",
    sku: "MBA-13-M2",
    name: "MacBook Air 13",
    description: "Light laptop with a long battery life",
    category: "Laptops",
    price: 1099,
    stock: 20,
    isActive: true,
    imageUrl: "https://picsum.photos/seed/air/640/480",
  },
  {
    id: "prod-iphone",
    sku: "IP15-128",
    name: "iPhone 15",
    description: "128 GB smartphone",
    category: "Phones",
    price: 799,
    stock: 30,
    isActive: true,
    imageUrl: "https://picsum.photos/seed/iphone/640/480",
  },
  {
    id: "prod-airpods",
    sku: "APP-2",
    name: "AirPods Pro 2",
    description: "Noise-cancelling earbuds",
    category: "Audio",
    price: 249,
    stock: 40,
    isActive: false,
    imageUrl: null,
  },
];

export const orders = [
  {
    id: "8f2a1c0e",
    customer: "anna@example.com",
    status: "PLACED",
    paymentStatus: "PENDING",
    totalAmount: 1598,
    createdAt: "2026-11-02T10:15:00.000Z",
  },
  {
    id: "b71d44aa",
    customer: "oleh@example.com",
    status: "IN_TRANSIT",
    paymentStatus: "PAID",
    totalAmount: 799,
    createdAt: "2026-11-04T14:40:00.000Z",
  },
  {
    id: "c90e18b2",
    customer: "maria@example.com",
    status: "DELIVERED",
    paymentStatus: "PAID",
    totalAmount: 2498,
    createdAt: "2026-10-18T09:05:00.000Z",
  },
  {
    id: "d33a77f1",
    customer: "anna@example.com",
    status: "CANCELLED",
    paymentStatus: "PENDING",
    totalAmount: 249,
    createdAt: "2026-11-06T18:20:00.000Z",
  },
];
