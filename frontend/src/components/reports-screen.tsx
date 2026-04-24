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

  return (
    <AppFrame>
      <section className="page-header">
        <p className="eyebrow">Relatorios</p>
        <h1>Numeros da operacao</h1>
        <p>Acompanhe pedidos, valor projetado e situacao do estoque.</p>
      </section>

      <section className="overview-grid" aria-label="Indicadores">
        <ReportCard label="Valor projetado" value={formatCurrency(orderSummary.totalRevenue)} />
        <ReportCard label="Pedidos confirmados" value={String(orderSummary.confirmed.length)} />
        <ReportCard label="Estoque baixo" value={String(productSummary.lowStock.length)} />
      </section>

      <section className="report-grid">
        <article className="panel-card">
          <p className="eyebrow">Pedidos</p>
          <h2>Distribuicao</h2>
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
          <h2>Visao comercial</h2>
          <dl className="report-list">
            <div>
              <dt>Total de produtos</dt>
              <dd>{productSummary.totalProducts}</dd>
            </div>
            <div>
              <dt>Estoque total</dt>
              <dd>{productSummary.totalStock}</dd>
            </div>
            <div>
              <dt>Ticket medio</dt>
              <dd>
                {formatCurrency(
                  orderSummary.totalOrders
                    ? orderSummary.totalRevenue / orderSummary.totalOrders
                    : 0,
                )}
              </dd>
            </div>
          </dl>
        </article>
      </section>
    </AppFrame>
  );
}

function ReportCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>operacao atual</small>
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
        <span
          className={`pipeline-fill pipeline-fill--${tone} ${widthClass}`}
        />
      </div>
      <b>{total}</b>
    </div>
  );
}

function getPipelineWidthClass(total: number) {
  if (total <= 0) {
    return "pipeline-fill--w-18";
  }

  if (total === 1) {
    return "pipeline-fill--w-46";
  }

  if (total === 2) {
    return "pipeline-fill--w-74";
  }

  return "pipeline-fill--w-100";
}
