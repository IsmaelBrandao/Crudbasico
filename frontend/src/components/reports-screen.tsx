"use client";

import { AppFrame } from "@/components/app-frame";
import { useOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency } from "@/lib/commercial-format";
import { getOrderSummary } from "@/lib/orders";
import { getProductSummary } from "@/lib/products";

export function ReportsScreen() {
  const { orders } = useOrders();
  const { products } = useProducts();
  const orderSummary = getOrderSummary(orders);
  const productSummary = getProductSummary(products);
  const ticketMedio = orderSummary.totalOrders
    ? orderSummary.totalRevenue / orderSummary.totalOrders
    : 0;

  return (
    <AppFrame>
      <section className="page-header">
        <div>
          <p className="eyebrow">Relatorios</p>
          <h1>Numeros</h1>
          <p>Acompanhe pedidos, valor projetado e situacao do estoque.</p>
        </div>
      </section>

      <section className="overview-grid" aria-label="Indicadores">
        <ReportCard label="Valor total" sublabel="em pedidos" value={formatCurrency(orderSummary.totalRevenue)} />
        <ReportCard label="Confirmados" sublabel="prontos para entrega" value={String(orderSummary.confirmed.length)} />
        <ReportCard label="Ticket medio" sublabel="por pedido" value={formatCurrency(ticketMedio)} accent />
      </section>

      <section className="report-grid">
        <article className="panel-card">
          <p className="eyebrow">Pedidos</p>
          <h2>Distribuicao por status</h2>
          <div className="pipeline report-pipeline">
            <PipelineRow
              label="Confirmados"
              total={orderSummary.confirmed.length}
              tone="active"
            />
            <PipelineRow
              label="Em preparo"
              total={orderSummary.preparing.length}
              tone="prospect"
            />
            <PipelineRow label="Pendentes" total={orderSummary.pending.length} tone="paused" />
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">Resumo</p>
          <h2>Visao geral</h2>
          <dl className="report-list">
            <div>
              <dt>Total de produtos</dt>
              <dd>{productSummary.totalProducts}</dd>
            </div>
            <div>
              <dt>Unidades em estoque</dt>
              <dd>{productSummary.totalStock}</dd>
            </div>
            <div>
              <dt>Valor em produto</dt>
              <dd>{formatCurrency(productSummary.totalValue)}</dd>
            </div>
            <div>
              <dt>Estoque baixo</dt>
              <dd>{productSummary.lowStock.length} {productSummary.lowStock.length === 1 ? "item" : "itens"}</dd>
            </div>
            <div>
              <dt>Total de pedidos</dt>
              <dd>{orderSummary.totalOrders}</dd>
            </div>
          </dl>
        </article>
      </section>
    </AppFrame>
  );
}

function ReportCard({
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

function PipelineRow({
  label,
  tone,
  total,
}: {
  label: string;
  tone: "active" | "paused" | "prospect";
  total: number;
}) {
  const widthClass = getPipelineWidthClass(total);

  return (
    <div className="pipeline-row">
      <span>{label}</span>
      <div className="pipeline-track">
        <span className={`pipeline-fill pipeline-fill--${tone} ${widthClass}`} />
      </div>
      <b>{total}</b>
    </div>
  );
}

function getPipelineWidthClass(total: number) {
  if (total <= 0) return "pipeline-fill--w-18";
  if (total === 1) return "pipeline-fill--w-46";
  if (total === 2) return "pipeline-fill--w-74";
  return "pipeline-fill--w-100";
}
