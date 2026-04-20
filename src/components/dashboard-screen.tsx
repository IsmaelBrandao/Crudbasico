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
      <section className="page-header">
        <p className="eyebrow">Painel</p>
        <h1>Bom trabalho, {session?.name ?? "usuario"}.</h1>
        <p>Veja o essencial e escolha a proxima acao.</p>
      </section>

      <section className="overview-grid" aria-label="Resumo">
        <MetricCard label="Clientes" value={String(summary.totalCustomers)} />
        <MetricCard label="Ativos" value={String(summary.active.length)} />
        <MetricCard
          accent
          label="Receita prevista"
          value={formatCurrency(summary.totalValue)}
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
            <Link className="action-row" href="/clientes">
              <span>Ver carteira completa</span>
              <strong>{summary.totalCustomers} clientes</strong>
            </Link>
            <Link className="action-row" href="/clientes?new=1">
              <span>Adicionar cliente</span>
              <strong>Novo</strong>
            </Link>
            <Link className="action-row" href="/relatorios">
              <span>Ver relatorios</span>
              <strong>{formatCurrency(summary.totalValue)}</strong>
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
      <small>carteira atual</small>
    </article>
  );
}
