export type OrderStatus = "Confirmado" | "Em preparo" | "Pendente";

export type Order = {
  createdAt: string;
  customerName: string;
  id: string;
  owner: string;
  productName: string;
  quantity: number;
  status: OrderStatus;
  unitPrice: number;
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
    customerName: "Atelie Aurora",
    id: "ped-1001",
    owner: "Ismael Brandao",
    productName: "Teclado mecanico",
    quantity: 2,
    status: "Confirmado",
    unitPrice: 199.9,
  },
  {
    createdAt: "2026-04-23T10:15:00.000Z",
    customerName: "Verde Campo Foods",
    id: "ped-1002",
    owner: "Equipe Comercial",
    productName: "Monitor ultrawide",
    quantity: 1,
    status: "Em preparo",
    unitPrice: 1499,
  },
  {
    createdAt: "2026-04-24T09:00:00.000Z",
    customerName: "Casa Nomade",
    id: "ped-1003",
    owner: "Atendimento",
    productName: "Mouse sem fio",
    quantity: 3,
    status: "Pendente",
    unitPrice: 129.9,
  },
];

export function mapApiOrder(order: ApiOrder): Order {
  return {
    createdAt: order.createdAt || order.updatedAt || new Date().toISOString(),
    customerName: order.usuario?.nome || `Usuario ${order.usuario_id}`,
    id: `PED-${order.id}`,
    owner: "Equipe Comercial",
    productName: order.produto?.nome || `Produto ${order.produto_id}`,
    quantity: Number(order.quantidade) || 0,
    status: "Confirmado",
    unitPrice: Number(order.produto?.preco) || 0,
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
