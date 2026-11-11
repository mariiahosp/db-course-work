export const categories = [
  { id: "cat-laptops", name: "Laptops", slug: "laptops" },
  { id: "cat-phones", name: "Phones", slug: "phones" },
  { id: "cat-audio", name: "Audio", slug: "audio" },
];

export const products = [
  {
    id: "prod-mbp",
    sku: "MBP-14-M3",
    name: "MacBook Pro 14",
    category: "Laptops",
    price: 1999,
    stock: 12,
    isActive: true,
  },
  {
    id: "prod-air",
    sku: "MBA-13-M2",
    name: "MacBook Air 13",
    category: "Laptops",
    price: 1099,
    stock: 20,
    isActive: true,
  },
  {
    id: "prod-iphone",
    sku: "IP15-128",
    name: "iPhone 15",
    category: "Phones",
    price: 799,
    stock: 30,
    isActive: true,
  },
  {
    id: "prod-airpods",
    sku: "APP-2",
    name: "AirPods Pro 2",
    category: "Audio",
    price: 249,
    stock: 40,
    isActive: false,
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
