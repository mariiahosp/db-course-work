export type CatalogCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

export const categories: CatalogCategory[] = [
  { id: "cat-laptops", name: "Laptops", slug: "laptops", imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=640&h=480&q=80" },
  { id: "cat-phones", name: "Phones", slug: "phones", imageUrl: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=640&h=480&q=80" },
  { id: "cat-audio", name: "Audio", slug: "audio", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=640&h=480&q=80" },
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
    imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=640&h=480&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=640&h=480&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=640&h=480&q=80",
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
    imageUrl: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=640&h=480&q=80",
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
