import { RoleEnum, type User } from "../types/user";

export const mockUsers: User[] = [
  {
    id: "user-anna",
    email: "anna@example.com",
    name: "Anna Kovalska",
    role: RoleEnum.CUSTOMER,
    createdAt: "2026-10-12T09:00:00.000Z",
    updatedAt: "2026-11-01T12:30:00.000Z",
  },
  {
    id: "user-oleh",
    email: "oleh@example.com",
    name: "Oleh Petrenko",
    role: RoleEnum.CUSTOMER,
    createdAt: "2026-09-03T15:20:00.000Z",
    updatedAt: "2026-10-20T08:10:00.000Z",
  },
  {
    id: "user-admin",
    email: "admin@example.com",
    name: "Store Admin",
    role: RoleEnum.ADMIN,
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-11-08T11:45:00.000Z",
  },
];
