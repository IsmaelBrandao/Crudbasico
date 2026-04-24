"use client";

import { AppFrame } from "@/components/app-frame";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency, formatDate } from "@/lib/commercial-format";
import {
  getProductAvailability,
  getProductSummary,
  productStatusClassName,
} from "@/lib/products";

export function ProductsScreen() {
  const { products, ready, source } = useProducts();
  const summary = getProductSummary(products);

  return (
    <AppFrame>
      <section className="page-header">
        <p className="eyebrow">Produtos</p>
        <h1>Catalogo comercial</h1>
        <p>Veja os itens cadastrados, acompanhe estoque e confira o valor estimado.</p>
      </section>

      <section className="overview-grid" aria-label="Resumo de produtos">
        <MetricCard label="Produtos cadastrados" value={String(summary.totalProducts)} />
        <MetricCard label="Estoque total" value={String(summary.totalStock)} />
        <MetricCard accent label="Valor em estoque" value={formatCurrency(summary.totalValue)} />
      </section>

      <section className="summary-strip" aria-label="Status do catalogo">
        <span>{summary.lowStock.length} com estoque baixo</span>
        <span>{summary.outOfStock.length} sem estoque</span>
        <span>
          {ready
            ? source === "api"
              ? "Dados sincronizados com a API"
              : "Exibindo base local"
            : "Carregando catalogo"}
        </span>
      </section>

      <section className="cards-grid">
        {products.map((product) => {
          const availability = getProductAvailability(product);

          return (
            <article className="customer-card" key={product.id}>
              <div className="customer-card__header">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                </div>
                <span className={`status-pill ${productStatusClassName[availability]}`}>
                  {availability}
                </span>
              </div>

              <dl className="customer-details">
                <div>
                  <dt>Preco</dt>
                  <dd>{formatCurrency(product.price)}</dd>
                </div>
                <div>
                  <dt>Estoque</dt>
                  <dd>{product.stock} unidades</dd>
                </div>
                <div>
                  <dt>Atualizado</dt>
                  <dd>{formatDate(product.updatedAt)}</dd>
                </div>
                <div>
                  <dt>Codigo</dt>
                  <dd>{product.id}</dd>
                </div>
              </dl>

              <p className="customer-note">{product.description}</p>
            </article>
          );
        })}
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
      <small>catalogo atual</small>
    </article>
  );
}
