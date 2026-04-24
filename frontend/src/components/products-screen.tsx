"use client";

import { useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { ProductModal } from "@/components/product-modal";
import { useProducts } from "@/hooks/use-products";
import { formatCurrency, formatDate } from "@/lib/commercial-format";
import {
  getProductAvailability,
  getProductImage,
  getProductSummary,
  Product,
  ProductForm,
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
          <h1>Catalogo</h1>
          <p>Acompanhe o estoque, precos e disponibilidade de todos os itens.</p>
        </div>
        <button className="primary-button" onClick={() => setModalMode("create")} type="button">
          Novo produto
        </button>
      </section>

      <section className="overview-grid" aria-label="Resumo de produtos">
        <MetricCard label="Produtos" sublabel="no catalogo" value={String(summary.totalProducts)} />
        <MetricCard label="Em estoque" sublabel="unidades totais" value={String(summary.totalStock)} />
        <MetricCard
          accent
          label="Valor estimado"
          sublabel="em produto"
          value={formatCurrency(summary.totalValue)}
        />
      </section>

      <section className="summary-strip" aria-label="Status do catalogo">
        <div className="stat-chip">
          <strong>{summary.totalProducts}</strong>
          <span>itens</span>
        </div>
        <div className="stat-chip">
          <strong>{summary.totalStock}</strong>
          <span>unidades</span>
        </div>
        {summary.lowStock.length > 0 && (
          <div className="stat-chip stat-chip--alert">
            <strong>{summary.lowStock.length}</strong>
            <span>estoque baixo</span>
          </div>
        )}
        {summary.outOfStock.length > 0 && (
          <div className="stat-chip stat-chip--alert">
            <strong>{summary.outOfStock.length}</strong>
            <span>sem estoque</span>
          </div>
        )}
        {ready && summary.outOfStock.length === 0 && summary.lowStock.length === 0 && (
          <div className="stat-chip stat-chip--ok">
            <strong>OK</strong>
            <span>estoque regular</span>
          </div>
        )}
      </section>

      {feedback ? (
        <p className="form-message" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <section className="products-grid">
        {products.map((product) => {
          const availability = getProductAvailability(product);

          return (
            <article className="product-card" key={product.id}>
              <div className="product-card__image">
                <img
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  src={getProductImage(product)}
                />
              </div>

              <div className="product-card__body">
                <div className="product-card__meta">
                  <span className="product-card__category">{product.category}</span>
                  <span className={`status-pill ${productStatusClassName[availability]}`}>
                    {availability}
                  </span>
                </div>

                <h3 className="product-card__name">{product.name}</h3>

                <p className="product-card__desc">{product.description}</p>

                <div className="product-card__pricing">
                  <span className="product-card__price">{formatCurrency(product.price)}</span>
                  <span className="product-card__stock">
                    {product.stock > 0 ? `${product.stock} em estoque` : "Sem estoque"}
                  </span>
                </div>

                <dl className="product-card__meta-row">
                  <div>
                    <dt>Atualizado</dt>
                    <dd>{formatDate(product.updatedAt)}</dd>
                  </div>
                  <div>
                    <dt>Codigo</dt>
                    <dd>{product.id}</dd>
                  </div>
                </dl>

                <div className="product-card__actions">
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
              </div>
            </article>
          );
        })}
      </section>

      {products.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhum produto cadastrado</strong>
          <span>Adicione o primeiro item para montar seu catalogo.</span>
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
