"use client";

import Link from "next/link";
import { AppFrame } from "@/components/app-frame";
import { useOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";
import { useSession } from "@/hooks/use-session";
import { formatCurrency, formatDate } from "@/lib/commercial-format";
import { getOrderSummary, orderStatusClassName } from "@/lib/orders";
import { getProductSummary } from "@/lib/products";

export function DashboardScreen() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const { session } = useSession({ requireAuth: true });
  const orderSummary = getOrderSummary(orders);
  const productSummary = getProductSummary(products);
  const recentOrders = orders.slice(0, 3);

  return (
    <AppFrame>
      <section className="page-header">
        <p className="eyebrow">Painel</p>
        <h1>Bom trabalho, {session?.name ?? "usuario"}.</h1>
        <p>Veja o essencial e escolha a proxima acao.</p>
      </section>

      <section className="overview-grid" aria-label="Resumo">
        <MetricCard label="Produtos" value={String(productSummary.totalProducts)} />
        <MetricCard label="Pedidos" value={String(orderSummary.totalOrders)} />
        <MetricCard
          accent
          label="Valor projetado"
          value={formatCurrency(orderSummary.totalRevenue)}
        />
      </section>

      <section className="dashboard-layout">
        <article className="panel-card">
          <div className="section-heading section-heading--row">
            <div>
              <p className="eyebrow">Atalhos</p>
              <h2>O que voce quer fazer?</h2>
            </div>
          </div>
          <div className="action-list">
            <Link className="action-row" href="/produtos">
              <span>Ver catalogo de produtos</span>
              <strong>{productSummary.totalProducts} itens</strong>
            </Link>
            <Link className="action-row" href="/pedidos">
              <span>Acompanhar pedidos</span>
              <strong>{orderSummary.confirmed.length} confirmados</strong>
            </Link>
            <Link className="action-row" href="/relatorios">
              <span>Ver relatorios</span>
              <strong>{formatCurrency(orderSummary.totalRevenue)}</strong>
            </Link>
          </div>
        </article>

        <article className="panel-card">
          <div className="section-heading section-heading--row">
            <div>
              <p className="eyebrow">Recentes</p>
              <h2>Ultimos pedidos</h2>
            </div>
          </div>
          <div className="compact-list">
            {recentOrders.map((order) => (
              <Link
                className="compact-record"
                href="/pedidos"
                key={order.id}
              >
                <span>
                  <strong>{order.code}</strong>
                  <small>{order.productName}</small>
                </span>
                <span className={`status-pill ${orderStatusClassName[order.status]}`}>
                  {order.status}
                </span>
                <small>{formatDate(order.createdAt)}</small>
              </Link>
            ))}
          </div>
        </article>
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
