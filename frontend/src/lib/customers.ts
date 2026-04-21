export type ClientStatus = "Ativo" | "Prospect" | "Pausado";
export type StatusFilter = "Todos" | ClientStatus;

export type Customer = {
  company: string;
  email: string;
  id: string;
  name: string;
  notes: string;
  phone: string;
  status: ClientStatus;
  updatedAt: string;
  value: number;
};

export type CustomerForm = Omit<Customer, "id" | "updatedAt">;

export const CUSTOMER_STORAGE_KEY = "nexo-clientes-v1";

export const emptyCustomerForm: CustomerForm = {
  company: "",
  email: "",
  name: "",
  notes: "",
  phone: "",
  status: "Prospect",
  value: 0,
};

export const seedCustomers: Customer[] = [
  {
    company: "Atelie Aurora",
    email: "marina@atelieaurora.com.br",
    id: "cli-aurora",
    name: "Marina Costa",
    notes: "Quer renovar a vitrine online ainda este mes.",
    phone: "(11) 99921-4410",
    status: "Ativo",
    updatedAt: "2026-04-18T10:30:00.000Z",
    value: 8200,
  },
  {
    company: "Verde Campo Foods",
    email: "rafael@verdecampo.com.br",
    id: "cli-verde",
    name: "Rafael Nunes",
    notes: "Enviar proposta com plano trimestral e suporte dedicado.",
    phone: "(31) 98842-1120",
    status: "Prospect",
    updatedAt: "2026-04-16T14:10:00.000Z",
    value: 12500,
  },
  {
    company: "Casa Nomade",
    email: "sofia@casanomade.com.br",
    id: "cli-nomade",
    name: "Sofia Almeida",
    notes: "Pausou por reorganizacao interna. Retomar contato em maio.",
    phone: "(21) 98109-7742",
    status: "Pausado",
    updatedAt: "2026-04-12T09:00:00.000Z",
    value: 4300,
  },
];

export const statusFilters: StatusFilter[] = [
  "Todos",
  "Ativo",
  "Prospect",
  "Pausado",
];

export const statusClassName: Record<ClientStatus, string> = {
  Ativo: "status-pill--active",
  Pausado: "status-pill--paused",
  Prospect: "status-pill--prospect",
};

export const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  maximumFractionDigits: 0,
  style: "currency",
});

export const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

export function createCustomerId() {
  return globalThis.crypto?.randomUUID?.() ?? `cli-${Date.now()}`;
}

export function formatCurrency(value: number) {
  return currencyFormatter.format(value || 0);
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value)).replace(".", "");
}

export function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export function getCustomerSummary(customers: Customer[]) {
  const active = customers.filter((customer) => customer.status === "Ativo");
  const prospects = customers.filter((customer) => customer.status === "Prospect");
  const paused = customers.filter((customer) => customer.status === "Pausado");
  const totalValue = customers.reduce((sum, customer) => sum + customer.value, 0);

  return {
    active,
    paused,
    prospects,
    totalCustomers: customers.length,
    totalValue,
  };
}
