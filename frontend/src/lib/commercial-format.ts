const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  maximumFractionDigits: 0,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

export function formatCurrency(value: number) {
  return currencyFormatter.format(value || 0);
}

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value)).replace(".", "");
}
