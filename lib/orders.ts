export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Paid"
  | "Delivered"
  | "Cancelled";

export type Order = {
  id: string;
  customer: string;
  email: string;
  phone: string;
  product: string;
  city: string;
  state: string;
  status: OrderStatus;
  date: string;
  total: number;
  reference?: string;
  paymentStatus?: string;
};

export const orderStatuses: OrderStatus[] = [
  "Pending",
  "Processing",
  "Paid",
  "Delivered",
  "Cancelled",
];

export const initialOrders: Order[] = [
  {
    id: "ORD-001",
    customer: "Emeka Okafor",
    email: "emeka@example.com",
    phone: "08012345678",
    product: 'Samsung 65" TV',
    city: "Lagos",
    state: "Lagos",
    status: "Pending",
    date: "June 14, 2026",
    total: 1180000,
  },
  {
    id: "ORD-002",
    customer: "Ngozi Adeyemi",
    email: "ngozi@example.com",
    phone: "08087654321",
    product: "iPhone 15 Pro",
    city: "Abuja",
    state: "FCT - Abuja",
    status: "Delivered",
    date: "June 13, 2026",
    total: 1350000,
  },
  {
    id: "ORD-003",
    customer: "Tunde Balogun",
    email: "tunde@example.com",
    phone: "08023456789",
    product: "LG Washing Machine",
    city: "Ibadan",
    state: "Oyo",
    status: "Processing",
    date: "June 12, 2026",
    total: 735000,
  },
  {
    id: "ORD-004",
    customer: "Amaka Eze",
    email: "amaka@example.com",
    phone: "08034567890",
    product: "Sony Soundbar",
    city: "Enugu",
    state: "Enugu",
    status: "Pending",
    date: "June 11, 2026",
    total: 215000,
  },
  {
    id: "ORD-005",
    customer: "Chidi Obi",
    email: "chidi@example.com",
    phone: "08045678901",
    product: "Hisense Fridge",
    city: "Port Harcourt",
    state: "Rivers",
    status: "Cancelled",
    date: "June 10, 2026",
    total: 1420000,
  },
];
