"use client";

import { AppFrame } from "@/components/app-frame";
import { useCustomers } from "@/hooks/use-customers";
import { formatCurrency, getCustomerSummary } from "@/lib/customers";

export function ReportsScreen() {
  const { customers } = useCustomers();
  const summary = getCustomerSummary(customers);

  return (
    <AppFrame>
      <section className="page-header">
        <p className="eyebrow">Relatorios</p>
        <h1>Numeros da carteira</h1>
        <p>Acompanhe valores, status e volume de clientes.</p>
      </section>

      <section className="overview-grid" aria-label="Indicadores">
        <ReportCard label="Valor total" value={formatCurrency(summary.totalValue)} />
        <ReportCard label="Clientes ativos" value={String(summary.active.length)} />
        <ReportCard label="Em negociacao" value={String(summary.prospects.length)} />
      </section>

      <section className="report-grid">
        <article className="panel-card">
          <p className="eyebrow">Status</p>
          <h2>Distribuicao</h2>
          <div className="pipeline report-pipeline">
            <PipelineRow label="Ativos" total={summary.active.length} tone="active" />
            <PipelineRow
              label="Prospects"
              total={summary.prospects.length}
              tone="prospect"
            />
            <PipelineRow label="Pausados" total={summary.paused.length} tone="paused" />
          </div>
        </article>

        <article className="panel-card">
          <p className="eyebrow">Resumo</p>
          <h2>Carteira atual</h2>
          <dl className="report-list">
            <div>
              <dt>Total de clientes</dt>
              <dd>{summary.totalCustomers}</dd>
            </div>
            <div>
              <dt>Receita prevista</dt>
              <dd>{formatCurrency(summary.totalValue)}</dd>
            </div>
            <div>
              <dt>Ticket medio</dt>
              <dd>
                {formatCurrency(
                  summary.totalCustomers ? summary.totalValue / summary.totalCustomers : 0,
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
      <small>carteira atual</small>
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
