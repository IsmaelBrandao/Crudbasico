"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  ClientStatus,
  Customer,
  CustomerForm,
  emptyCustomerForm,
} from "@/lib/customers";

type CustomerModalProps = {
  customer?: Customer | null;
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (form: CustomerForm) => void;
  open: boolean;
};

export function CustomerModal({
  customer,
  mode,
  onClose,
  onSubmit,
  open,
}: CustomerModalProps) {
  const [form, setForm] = useState<CustomerForm>(emptyCustomerForm);
  const [message, setMessage] = useState("Preencha os dados principais.");
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!open) {
      return;
    }

    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      if (mode === "edit" && customer) {
        setForm({
          company: customer.company,
          email: customer.email,
          name: customer.name,
          notes: customer.notes,
          phone: customer.phone,
          status: customer.status,
          value: customer.value,
        });
        setMessage(`Editando ${customer.name}.`);
      } else {
        setForm(emptyCustomerForm);
        setMessage("Preencha os dados principais.");
      }

      setStep(1);
    });

    return () => {
      isMounted = false;
    };
  }, [customer, mode, open]);

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

  function updateForm<Field extends keyof CustomerForm>(
    field: Field,
    value: CustomerForm[Field],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function validateFirstStep() {
    if (!form.name.trim() || !form.company.trim() || !form.email.trim()) {
      setMessage("Preencha nome, empresa e email para continuar.");
      return false;
    }

    if (!form.email.includes("@")) {
      setMessage("Confira o email antes de continuar.");
      return false;
    }

    setMessage("Agora complete a oportunidade.");
    return true;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateFirstStep()) {
      setStep(1);
      return;
    }

    onSubmit({
      ...form,
      company: form.company.trim(),
      email: form.email.trim(),
      name: form.name.trim(),
      notes: form.notes.trim(),
      phone: form.phone.trim(),
      value: Math.max(0, Number(form.value) || 0),
    });
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="customer-modal-title"
        aria-modal="true"
        className="customer-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <aside className="modal-aside">
          <p className="eyebrow">{mode === "edit" ? "Edicao" : "Novo cliente"}</p>
          <h2 id="customer-modal-title">
            {mode === "edit" ? "Atualizar oportunidade" : "Cadastrar sem sair da carteira"}
          </h2>
          <p>
            O cadastro fica dentro de um modal em duas etapas. A lista continua
            no fundo, sem virar uma tela longa e confusa.
          </p>

          <div className="modal-progress">
            <span className={step === 1 ? "active" : ""}>Contato</span>
            <span className={step === 2 ? "active" : ""}>Oportunidade</span>
          </div>
        </aside>

        <form className="modal-form" onSubmit={handleSubmit}>
          <button
            aria-label="Fechar modal"
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            x
          </button>

          <div className="stepper" aria-label="Etapas do cadastro">
            <span className={step === 1 ? "step-dot active" : "step-dot"}>1</span>
            <span />
            <span className={step === 2 ? "step-dot active" : "step-dot"}>2</span>
          </div>

          {step === 1 ? (
            <div className="stack-form">
              <div className="section-heading">
                <p className="eyebrow">Etapa 1</p>
                <h3>Dados do contato</h3>
              </div>

              <label>
                Nome do contato
                <input
                  autoComplete="name"
                  autoFocus
                  onChange={(event) => updateForm("name", event.target.value)}
                  placeholder="Ex.: Ana Martins"
                  required
                  value={form.name}
                />
              </label>

              <label>
                Empresa
                <input
                  autoComplete="organization"
                  onChange={(event) => updateForm("company", event.target.value)}
                  placeholder="Ex.: Studio Solar"
                  required
                  value={form.company}
                />
              </label>

              <div className="field-grid">
                <label>
                  Email
                  <input
                    autoComplete="email"
                    onChange={(event) => updateForm("email", event.target.value)}
                    placeholder="ana@empresa.com"
                    required
                    type="email"
                    value={form.email}
                  />
                </label>

                <label>
                  Telefone
                  <input
                    autoComplete="tel"
                    onChange={(event) => updateForm("phone", event.target.value)}
                    placeholder="(00) 90000-0000"
                    value={form.phone}
                  />
                </label>
              </div>

              <button
                className="primary-button"
                onClick={() => validateFirstStep() && setStep(2)}
                type="button"
              >
                Continuar
              </button>
            </div>
          ) : (
            <div className="stack-form">
              <div className="section-heading">
                <p className="eyebrow">Etapa 2</p>
                <h3>Valor e contexto</h3>
              </div>

              <div className="field-grid">
                <label>
                  Status
                  <select
                    onChange={(event) =>
                      updateForm("status", event.target.value as ClientStatus)
                    }
                    value={form.status}
                  >
                    <option value="Prospect">Prospect</option>
                    <option value="Ativo">Ativo</option>
                    <option value="Pausado">Pausado</option>
                  </select>
                </label>

                <label>
                  Valor previsto
                  <input
                    inputMode="numeric"
                    min="0"
                    onChange={(event) =>
                      updateForm(
                        "value",
                        event.target.value ? Number(event.target.value) : 0,
                      )
                    }
                    placeholder="0"
                    type="number"
                    value={form.value || ""}
                  />
                </label>
              </div>

              <label>
                Observacoes
                <textarea
                  onChange={(event) => updateForm("notes", event.target.value)}
                  placeholder="Ex.: prefere contato pela manha, enviar proposta revisada..."
                  rows={5}
                  value={form.notes}
                />
              </label>

              <div className="form-actions">
                <button
                  className="secondary-button"
                  onClick={() => setStep(1)}
                  type="button"
                >
                  Voltar
                </button>
                <button className="primary-button" type="submit">
                  {mode === "edit" ? "Salvar alteracoes" : "Cadastrar cliente"}
                </button>
              </div>
            </div>
          )}

          <p className="form-message" aria-live="polite">
            {message}
          </p>
        </form>
      </section>
    </div>
  );
}
