"use client";

import { FormEvent, useEffect, useState } from "react";
import { DataSource } from "@/lib/api";
import { emptyProductForm, Product, ProductForm } from "@/lib/products";

type ProductModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (form: ProductForm) => Promise<void>;
  open: boolean;
  product?: Product | null;
  source: DataSource;
};

export function ProductModal({
  mode,
  onClose,
  onSubmit,
  open,
  product,
  source,
}: ProductModalProps) {
  const [form, setForm] = useState<ProductForm>(emptyProductForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("Preencha nome, preco e estoque do produto.");

  useEffect(() => {
    if (!open) {
      return;
    }

    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      if (mode === "edit" && product) {
        setForm({
          name: product.name,
          price: product.price,
          stock: product.stock,
        });
        setMessage(`Atualizando ${product.name}.`);
      } else {
        setForm(emptyProductForm);
        setMessage("Preencha nome, preco e estoque do produto.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [mode, open, product]);

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

  function updateForm<Field extends keyof ProductForm>(field: Field, value: ProductForm[Field]) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!form.name.trim()) {
      setMessage("Informe o nome do produto.");
      return false;
    }

    if (Number(form.price) < 0) {
      setMessage("O preco nao pode ser negativo.");
      return false;
    }

    if (!Number.isInteger(Number(form.stock)) || Number(form.stock) < 0) {
      setMessage("O estoque deve ser um numero inteiro maior ou igual a zero.");
      return false;
    }

    setMessage(
      source === "api"
        ? "Os dados serao enviados para a API."
        : "Os dados serao salvos localmente neste navegador.",
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
        name: form.name.trim(),
        price: Math.max(0, Number(form.price) || 0),
        stock: Math.max(0, Math.trunc(Number(form.stock) || 0)),
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Nao foi possivel salvar o produto.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="product-modal-title"
        aria-modal="true"
        className="form-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <aside className="modal-aside">
          <div>
            <p className="eyebrow">{mode === "edit" ? "Editar produto" : "Novo produto"}</p>
            <h2 id="product-modal-title">
              {mode === "edit" ? "Atualizar cadastro" : "Cadastrar produto"}
            </h2>
            <p>Mantenha o catalogo comercial organizado e com estoque em dia.</p>
          </div>

          <div className="modal-progress">
            <span className="active">{source === "api" ? "Sincronizado com API" : "Base local"}</span>
          </div>
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
              <p className="eyebrow">Cadastro</p>
              <h3>Dados principais</h3>
            </div>

            <label>
              Nome do produto
              <input
                autoFocus
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Ex.: Monitor ultrawide"
                required
                value={form.name}
              />
            </label>

            <div className="field-grid">
              <label>
                Preco
                <input
                  inputMode="decimal"
                  min="0"
                  onChange={(event) =>
                    updateForm(
                      "price",
                      event.target.value ? Number(event.target.value) : 0,
                    )
                  }
                  placeholder="0"
                  step="0.01"
                  type="number"
                  value={form.price || ""}
                />
              </label>

              <label>
                Estoque
                <input
                  inputMode="numeric"
                  min="0"
                  onChange={(event) =>
                    updateForm(
                      "stock",
                      event.target.value ? Number(event.target.value) : 0,
                    )
                  }
                  placeholder="0"
                  step="1"
                  type="number"
                  value={form.stock || ""}
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
                    : "Cadastrar produto"}
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
