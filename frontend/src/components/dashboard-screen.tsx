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
  const recentOrders = orders.slice(0, 4);
  const firstName = session?.name?.split(" ")[0] ?? "usuario";

  return (
    <AppFrame>
      <section className="page-header">
        <div>
          <p className="eyebrow">Painel</p>
          <h1>Ola, {firstName}.</h1>
          <p>Veja o que esta acontecendo e escolha o proximo passo.</p>
        </div>
      </section>

      <section className="overview-grid" aria-label="Resumo geral">
        <MetricCard label="Produtos" sublabel="no catalogo" value={String(productSummary.totalProducts)} />
        <MetricCard label="Pedidos" sublabel="registrados" value={String(orderSummary.totalOrders)} />
        <MetricCard
          accent
          label="Valor total"
          sublabel="em pedidos"
          value={formatCurrency(orderSummary.totalRevenue)}
        />
      </section>

      <section className="dashboard-layout">
        <article className="panel-card">
          <p className="eyebrow">Acesso rapido</p>
          <h2>Por onde comecar</h2>

          <div className="action-list">
            <Link className="action-row" href="/produtos">
              <div>
                <strong>Catalogo de produtos</strong>
                <small>Estoque e precos</small>
              </div>
              <span className="action-count">{productSummary.totalProducts}</span>
            </Link>
            <Link className="action-row" href="/pedidos">
              <div>
                <strong>Pedidos da operacao</strong>
                <small>Acompanhar andamento</small>
              </div>
              <span className="action-count">{orderSummary.confirmed.length}</span>
            </Link>
            <Link className="action-row" href="/relatorios">
              <div>
                <strong>Relatorios</strong>
                <small>Numeros e indicadores</small>
              </div>
              <span className="action-count action-count--value">{formatCurrency(orderSummary.totalRevenue)}</span>
            </Link>
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">Recentes</p>
          <h2>Ultimos pedidos</h2>

          {recentOrders.length > 0 ? (
            <div className="compact-list">
              {recentOrders.map((order) => (
                <Link className="compact-record" href="/pedidos" key={order.id}>
                  <span>
                    <strong>{order.code}</strong>
                    <small>{order.productName}</small>
                  </span>
                  <span className={`status-pill ${orderStatusClassName[order.status]}`}>
                    {order.status}
                  </span>
                  <small className="compact-date">{formatDate(order.createdAt)}</small>
                </Link>
              ))}
            </div>
          ) : (
            <p className="empty-note">Nenhum pedido registrado ainda.</p>
          )}
        </article>
      </section>
    </AppFrame>
  );
}

function MetricCard({
  accent = false,
  label,
  sublabel,
  value,
}: {
  accent?: boolean;
  label: string;
  sublabel: string;
  value: string;
}) {
  return (
    <article className={accent ? "metric-card metric-card--accent" : "metric-card"}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{sublabel}</small>
    </article>
  );
}
