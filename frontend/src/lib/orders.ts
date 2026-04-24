import type { Product } from "@/lib/products";
import type { UserCard } from "@/lib/users";

export type OrderStatus = "Confirmado" | "Em preparo" | "Pendente";

export type Order = {
  createdAt: string;
  customerName: string;
  customerId: string;
  code: string;
  id: string;
  owner: string;
  productId: string;
  productName: string;
  quantity: number;
  status: OrderStatus;
  unitPrice: number;
};

export type OrderForm = {
  customerId: string;
  productId: string;
  quantity: number;
};

export type ApiOrder = {
  createdAt?: string;
  id: number;
  produto?: {
    nome: string;
    preco?: number | string;
  };
  produto_id: number;
  quantidade: number;
  updatedAt?: string;
  usuario?: {
    nome: string;
  };
  usuario_id: number;
};

export const seedOrders: Order[] = [
  {
    createdAt: "2026-04-23T08:30:00.000Z",
    customerName: "Equipe Comercial",
    customerId: "usr-comercial",
    code: "PED-1001",
    id: "ped-1001",
    owner: "Equipe Comercial",
    productId: "prod-teclado",
    productName: "Teclado mecanico",
    quantity: 2,
    status: "Confirmado",
    unitPrice: 199.9,
  },
  {
    createdAt: "2026-04-23T10:15:00.000Z",
    customerName: "Atendimento",
    customerId: "usr-atendimento",
    code: "PED-1002",
    id: "ped-1002",
    owner: "Atendimento",
    productId: "prod-monitor",
    productName: "Monitor ultrawide",
    quantity: 1,
    status: "Em preparo",
    unitPrice: 1499,
  },
  {
    createdAt: "2026-04-24T09:00:00.000Z",
    customerName: "Equipe Comercial",
    customerId: "usr-comercial",
    code: "PED-1003",
    id: "ped-1003",
    owner: "Equipe Comercial",
    productId: "prod-mouse",
    productName: "Mouse sem fio",
    quantity: 3,
    status: "Pendente",
    unitPrice: 129.9,
  },
];

export const emptyOrderForm: OrderForm = {
  customerId: "",
  productId: "",
  quantity: 1,
};

export function mapApiOrder(order: ApiOrder): Order {
  return {
    createdAt: order.createdAt || order.updatedAt || new Date().toISOString(),
    customerName: order.usuario?.nome || `Usuario ${order.usuario_id}`,
    customerId: String(order.usuario_id),
    code: formatOrderCode(order.id),
    id: String(order.id),
    owner: order.usuario?.nome || "Equipe Comercial",
    productId: String(order.produto_id),
    productName: order.produto?.nome || `Produto ${order.produto_id}`,
    quantity: Number(order.quantidade) || 0,
    status: "Confirmado",
    unitPrice: Number(order.produto?.preco) || 0,
  };
}

export function mapOrderToApiInput(order: OrderForm) {
  return {
    produto_id: Number(order.productId),
    quantidade: Math.max(1, Math.trunc(Number(order.quantity) || 0)),
    usuario_id: Number(order.customerId),
  };
}

export function createOrderId() {
  return globalThis.crypto?.randomUUID?.() ?? `ped-${Date.now()}`;
}

export function createLocalOrder(
  form: OrderForm,
  users: UserCard[],
  products: Product[],
): Order {
  const id = createOrderId();
  const details = getOrderDetails(form, users, products);

  return {
    createdAt: new Date().toISOString(),
    customerId: form.customerId,
    customerName: details.customerName,
    code: createLocalOrderCode(),
    id,
    owner: details.customerName,
    productId: form.productId,
    productName: details.productName,
    quantity: Math.max(1, Math.trunc(Number(form.quantity) || 0)),
    status: "Pendente",
    unitPrice: details.unitPrice,
  };
}

export function updateLocalOrder(
  order: Order,
  form: OrderForm,
  users: UserCard[],
  products: Product[],
): Order {
  const details = getOrderDetails(form, users, products);

  return {
    ...order,
    createdAt: new Date().toISOString(),
    customerId: form.customerId,
    customerName: details.customerName,
    owner: details.customerName,
    productId: form.productId,
    productName: details.productName,
    quantity: Math.max(1, Math.trunc(Number(form.quantity) || 0)),
    unitPrice: details.unitPrice,
  };
}

export const orderStatusClassName: Record<OrderStatus, string> = {
  Confirmado: "status-pill--active",
  "Em preparo": "status-pill--prospect",
  Pendente: "status-pill--paused",
};

export function getOrderTotal(order: Order) {
  return order.quantity * order.unitPrice;
}

export function getOrderSummary(orders: Order[]) {
  const confirmed = orders.filter((order) => order.status === "Confirmado");
  const preparing = orders.filter((order) => order.status === "Em preparo");
  const pending = orders.filter((order) => order.status === "Pendente");
  const totalRevenue = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);

  return {
    confirmed,
    pending,
    preparing,
    totalOrders: orders.length,
    totalRevenue,
  };
}

function formatOrderCode(value: number | string) {
  const rawValue = String(value);
  const onlyDigits = rawValue.replace(/\D/g, "");

  if (onlyDigits) {
    return `PED-${onlyDigits.padStart(4, "0")}`;
  }

  return rawValue.toUpperCase();
}

function createLocalOrderCode() {
  return `PED-${String(Date.now()).slice(-4)}`;
}

function getOrderDetails(
  form: OrderForm,
  users: UserCard[],
  products: Product[],
) {
  const user = users.find((item) => item.id === form.customerId);
  const product = products.find((item) => item.id === form.productId);

  return {
    customerName: user?.name || "Usuario",
    productName: product?.name || "Produto",
    unitPrice: product?.price || 0,
  };
}
