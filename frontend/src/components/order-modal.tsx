"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { DataSource } from "@/lib/api";
import { formatCurrency } from "@/lib/commercial-format";
import { emptyOrderForm, Order, OrderForm } from "@/lib/orders";
import { Product } from "@/lib/products";
import { UserCard } from "@/lib/users";

type OrderModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (form: OrderForm) => Promise<void>;
  open: boolean;
  order?: Order | null;
  products: Product[];
  source: DataSource;
  users: UserCard[];
};

export function OrderModal({
  mode,
  onClose,
  onSubmit,
  open,
  order,
  products,
  source,
  users,
}: OrderModalProps) {
  const [form, setForm] = useState<OrderForm>(emptyOrderForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("Selecione usuario, produto e quantidade.");
  const selectedProduct = useMemo(
    () => products.find((item) => item.id === form.productId),
    [form.productId, products],
  );

  useEffect(() => {
    if (!open) {
      return;
    }

    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      if (mode === "edit" && order) {
        setForm({
          customerId: order.customerId,
          productId: order.productId,
          quantity: order.quantity,
        });
        setMessage(`Atualizando ${order.code}.`);
        return;
      }

      setForm({
        customerId: users[0]?.id || "",
        productId: products[0]?.id || "",
        quantity: 1,
      });
      setMessage("Selecione usuario, produto e quantidade.");
    });

    return () => {
      isMounted = false;
    };
  }, [mode, open, order, products, users]);

  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  function updateForm<Field extends keyof OrderForm>(field: Field, value: OrderForm[Field]) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!users.length) {
      setMessage("Cadastre pelo menos um usuario antes de criar pedidos.");
      return false;
    }

    if (!products.length) {
      setMessage("Cadastre pelo menos um produto antes de criar pedidos.");
      return false;
    }

    if (!form.customerId) {
      setMessage("Selecione um usuario.");
      return false;
    }

    if (!form.productId) {
      setMessage("Selecione um produto.");
      return false;
    }

    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) <= 0) {
      setMessage("A quantidade deve ser um numero inteiro maior que zero.");
      return false;
    }

    if (mode === "create" && selectedProduct && Number(form.quantity) > selectedProduct.stock) {
      setMessage("A quantidade informada esta maior que o estoque atual.");
      return false;
    }

    setMessage(
      source === "api"
        ? "O pedido sera enviado para a API."
        : "O pedido sera salvo localmente neste navegador.",
    );
    return true;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        customerId: form.customerId,
        productId: form.productId,
        quantity: Math.max(1, Math.trunc(Number(form.quantity) || 0)),
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Nao foi possivel salvar o pedido.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="order-modal-title"
        aria-modal="true"
        className="customer-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <aside className="modal-aside">
          <div>
            <p className="eyebrow">{mode === "edit" ? "Editar pedido" : "Novo pedido"}</p>
            <h2 id="order-modal-title">
              {mode === "edit" ? "Atualizar pedido" : "Cadastrar pedido"}
            </h2>
            <p>Associe o pedido a um usuario, escolha o produto e informe a quantidade.</p>
          </div>

          <div className="modal-progress">
            <span className="active">{source === "api" ? "Sincronizado com API" : "Base local"}</span>
          </div>

          {selectedProduct ? (
            <div className="modal-progress">
              <span>{selectedProduct.stock} em estoque</span>
              <span>{formatCurrency(selectedProduct.price)} por unidade</span>
            </div>
          ) : null}
        </aside>

        <form className="modal-form" onSubmit={handleSubmit}>
          <button
            aria-label="Fechar cadastro"
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            x
          </button>

          <div className="stack-form">
            <div className="section-heading">
              <p className="eyebrow">Pedido</p>
              <h3>Dados principais</h3>
            </div>

            <label>
              Usuario
              <select
                onChange={(event) => updateForm("customerId", event.target.value)}
                value={form.customerId}
              >
                <option value="">Selecione</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="field-grid">
              <label>
                Produto
                <select
                  onChange={(event) => updateForm("productId", event.target.value)}
                  value={form.productId}
                >
                  <option value="">Selecione</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Quantidade
                <input
                  inputMode="numeric"
                  min="1"
                  onChange={(event) =>
                    updateForm(
                      "quantity",
                      event.target.value ? Number(event.target.value) : 1,
                    )
                  }
                  step="1"
                  type="number"
                  value={form.quantity || ""}
                />
              </label>
            </div>

            <div className="form-actions">
              <button className="secondary-button" onClick={onClose} type="button">
                Cancelar
              </button>
              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting
                  ? "Salvando..."
                  : mode === "edit"
                    ? "Salvar alteracoes"
                    : "Cadastrar pedido"}
              </button>
            </div>
          </div>

          <p className="form-message" aria-live="polite">
            {message}
          </p>
        </form>
      </section>
    </div>
  );
}
