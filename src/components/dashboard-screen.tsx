"use client";

import Link from "next/link";
import { AppFrame } from "@/components/app-frame";
import { useCustomers } from "@/hooks/use-customers";
import { useSession } from "@/hooks/use-session";
import {
  formatCurrency,
  formatDate,
  getCustomerSummary,
  statusClassName,
} from "@/lib/customers";

export function DashboardScreen() {
  const { customers } = useCustomers();
  const { session } = useSession({ requireAuth: true });
  const summary = getCustomerSummary(customers);
  const recentCustomers = customers.slice(0, 3);

  return (
    <AppFrame>
      <section className="page-hero">
        <div>
          <p className="eyebrow">Painel</p>
          <h1>Bom trabalho, {session?.name ?? "usuario"}.</h1>
          <p>
            Acompanhe sua carteira sem poluicao visual. As proximas acoes ficam
            separadas da lista e do cadastro.
          </p>
        </div>
        <div className="hero-card">
          <div className="hero-card__top">
            <span>Receita prevista</span>
            <strong>{formatCurrency(summary.totalValue)}</strong>
          </div>
          <div className="pipeline">
            <PipelineRow label="Ativos" total={summary.active.length} tone="active" />
            <PipelineRow
              label="Prospects"
              total={summary.prospects.length}
              tone="prospect"
            />
            <PipelineRow label="Pausados" total={summary.paused.length} tone="paused" />
          </div>
        </div>
      </section>

      <section className="metrics-grid" aria-label="Indicadores">
        <MetricCard label="Total na base" value={String(summary.totalCustomers)} />
        <MetricCard label="Clientes ativos" value={String(summary.active.length)} />
        <MetricCard label="Em negociacao" value={String(summary.prospects.length)} />
        <MetricCard
          accent
          label="Valor mapeado"
          value={formatCurrency(summary.totalValue)}
        />
      </section>

      <section className="screen-grid two-columns">
        <article className="panel-card">
          <div className="section-heading section-heading--row">
            <div>
              <p className="eyebrow">Proximos passos</p>
              <h2>Organize sua rotina</h2>
            </div>
          </div>
          <div className="action-list">
            <Link className="action-row" href="/clientes">
              <span>Ver carteira completa</span>
              <strong>{summary.totalCustomers} clientes</strong>
            </Link>
            <Link className="action-row" href="/clientes/novo">
              <span>Cadastrar nova oportunidade</span>
              <strong>2 etapas</strong>
            </Link>
          </div>
        </article>

        <article className="panel-card">
          <div className="section-heading section-heading--row">
            <div>
              <p className="eyebrow">Recentes</p>
              <h2>Ultimos contatos</h2>
            </div>
          </div>
          <div className="compact-list">
            {recentCustomers.map((customer) => (
              <Link
                className="compact-customer"
                href={`/clientes?edit=${customer.id}`}
                key={customer.id}
              >
                <span>
                  <strong>{customer.name}</strong>
                  <small>{customer.company}</small>
                </span>
                <span className={`status-pill ${statusClassName[customer.status]}`}>
                  {customer.status}
                </span>
                <small>{formatDate(customer.updatedAt)}</small>
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
      <small>atualizado agora</small>
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
  return (
    <div className="pipeline-row">
      <span>{label}</span>
      <div className="pipeline-track">
        <span
          className={`pipeline-fill pipeline-fill--${tone}`}
          style={{ width: `${Math.min(100, total * 28 + 18)}%` }}
        />
      </div>
      <b>{total}</b>
    </div>
  );
}
