"use client";

import { useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { ProductModal } from "@/components/product-modal";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency, formatDate } from "@/lib/commercial-format";
import {
  getProductAvailability,
  Product,
  ProductForm,
  getProductSummary,
  productStatusClassName,
} from "@/lib/products";

export function ProductsScreen() {
  const { addProduct, products, ready, removeProduct, updateProduct } = useProducts();
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [feedback, setFeedback] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const summary = getProductSummary(products);

  async function handleSubmit(form: ProductForm) {
    if (modalMode === "edit" && activeProduct) {
      await updateProduct(activeProduct.id, form);
      setFeedback("Produto atualizado com sucesso.");
    } else {
      await addProduct(form);
      setFeedback("Produto cadastrado com sucesso.");
    }

    closeModal();
  }

  async function handleDelete(product: Product) {
    const shouldDelete = window.confirm(`Remover ${product.name} do catalogo?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await removeProduct(product.id);
      setFeedback("Produto removido com sucesso.");
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Nao foi possivel remover o produto.",
      );
    }
  }

  function closeModal() {
    setActiveProduct(null);
    setModalMode(null);
  }

  return (
    <AppFrame>
      <section className="page-header">
        <div>
          <p className="eyebrow">Produtos</p>
          <h1>Catalogo comercial</h1>
          <p>Veja os itens cadastrados, acompanhe estoque e confira o valor estimado.</p>
        </div>
        <button className="primary-button" onClick={() => setModalMode("create")} type="button">
          Novo produto
        </button>
      </section>

      <section className="overview-grid" aria-label="Resumo de produtos">
        <MetricCard label="Produtos cadastrados" value={String(summary.totalProducts)} />
        <MetricCard label="Estoque total" value={String(summary.totalStock)} />
        <MetricCard accent label="Valor em estoque" value={formatCurrency(summary.totalValue)} />
      </section>

      <section className="summary-strip" aria-label="Status do catalogo">
        <span>{summary.lowStock.length} com estoque baixo</span>
        <span>{summary.outOfStock.length} sem estoque</span>
        <span>{ready ? "Catalogo pronto" : "Carregando catalogo"}</span>
      </section>

      {feedback ? (
        <p className="form-message" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <section className="cards-grid">
        {products.map((product) => {
          const availability = getProductAvailability(product);

          return (
            <article className="record-card" key={product.id}>
              <div className="record-card__header">
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                </div>
                <span className={`status-pill ${productStatusClassName[availability]}`}>
                  {availability}
                </span>
              </div>

              <dl className="record-details">
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

              <p className="record-note">{product.description}</p>

              <div className="card-actions">
                <button
                  className="ghost-button"
                  onClick={() => {
                    setActiveProduct(product);
                    setModalMode("edit");
                  }}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="danger-button"
                  onClick={() => handleDelete(product)}
                  type="button"
                >
                  Remover
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {products.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhum produto cadastrado.</strong>
          <span>Adicione um novo item para iniciar o catalogo.</span>
        </div>
      ) : null}

      <ProductModal
        mode={modalMode ?? "create"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        open={modalMode !== null}
        product={activeProduct}
      />
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
