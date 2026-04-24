"use client";

import { AppFrame } from "@/components/app-frame";
import { useOrders } from "@/hooks/use-orders";
import { formatCurrency, formatDate } from "@/lib/commercial-format";
import { getOrderSummary, getOrderTotal, orderStatusClassName } from "@/lib/orders";

export function OrdersScreen() {
  const { orders, ready, source } = useOrders();
  const summary = getOrderSummary(orders);

  return (
    <AppFrame>
      <section className="page-header">
        <p className="eyebrow">Pedidos</p>
        <h1>Acompanhamento da operacao</h1>
        <p>Monitore cada pedido, o responsavel e o valor movimentado.</p>
      </section>

      <section className="overview-grid" aria-label="Resumo de pedidos">
        <MetricCard label="Pedidos" value={String(summary.totalOrders)} />
        <MetricCard label="Confirmados" value={String(summary.confirmed.length)} />
        <MetricCard accent label="Valor projetado" value={formatCurrency(summary.totalRevenue)} />
      </section>

      <section className="summary-strip" aria-label="Fluxo operacional">
        <span>{summary.preparing.length} em preparo</span>
        <span>{summary.pending.length} pendentes</span>
        <span>
          {ready
            ? source === "api"
              ? "Pedidos carregados da API"
              : "Exibindo pedidos locais"
            : "Carregando pedidos"}
        </span>
      </section>

      <section className="cards-grid">
        {orders.map((order) => (
          <article className="customer-card" key={order.id}>
            <div className="customer-card__header">
              <div>
                <h3>{order.id}</h3>
                <p>{order.customerName}</p>
              </div>
              <span className={`status-pill ${orderStatusClassName[order.status]}`}>
                {order.status}
              </span>
            </div>

            <dl className="customer-details">
              <div>
                <dt>Produto</dt>
                <dd>{order.productName}</dd>
              </div>
              <div>
                <dt>Quantidade</dt>
                <dd>{order.quantity}</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatCurrency(getOrderTotal(order))}</dd>
              </div>
              <div>
                <dt>Data</dt>
                <dd>{formatDate(order.createdAt)}</dd>
              </div>
            </dl>

            <p className="customer-note">Responsavel pelo acompanhamento: {order.owner}.</p>
          </article>
        ))}
      </section>
    </AppFrame>
  );
}

function MetricCard({
  accent = false,
  label,
  value,
}: {
  accent?: boolean;
  label: string;
  value: string;
}) {
  return (
    <article className={accent ? "metric-card metric-card--accent" : "metric-card"}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>operacao atual</small>
    </article>
  );
}
