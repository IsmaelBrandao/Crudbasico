"use client";

import { FormEvent, useEffect, useState } from "react";
import { DataSource } from "@/lib/api";
import { emptyUserForm, UserCard, UserForm } from "@/lib/users";

type UserModalProps = {
  mode: "create" | "edit";
  onClose: () => void;
  onSubmit: (form: UserForm) => Promise<void>;
  open: boolean;
  source: DataSource;
  user?: UserCard | null;
};

export function UserModal({
  mode,
  onClose,
  onSubmit,
  open,
  source,
  user,
}: UserModalProps) {
  const [form, setForm] = useState<UserForm>(emptyUserForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("Preencha nome, email e senha de acesso.");

  useEffect(() => {
    if (!open) {
      return;
    }

    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      if (mode === "edit" && user) {
        setForm({
          email: user.email,
          name: user.name,
          password: "",
        });
        setMessage("Atualize os dados do usuario. A senha pode ficar em branco.");
      } else {
        setForm(emptyUserForm);
        setMessage("Preencha nome, email e senha de acesso.");
      }
    });

    return () => {
      isMounted = false;
    };
  }, [mode, open, user]);

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

  function updateForm<Field extends keyof UserForm>(field: Field, value: UserForm[Field]) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function validateForm() {
    if (!form.name.trim()) {
      setMessage("Informe o nome do usuario.");
      return false;
    }

    if (!form.email.trim() || !form.email.includes("@")) {
      setMessage("Informe um email valido.");
      return false;
    }

    if (mode === "create" && form.password.length < 6) {
      setMessage("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (mode === "edit" && form.password && form.password.length < 6) {
      setMessage("Se for alterar a senha, use pelo menos 6 caracteres.");
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
        email: form.email.trim(),
        name: form.name.trim(),
        password: form.password,
      });
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Nao foi possivel salvar o usuario.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="user-modal-title"
        aria-modal="true"
        className="form-modal"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <aside className="modal-aside">
          <div>
            <p className="eyebrow">{mode === "edit" ? "Editar usuario" : "Novo usuario"}</p>
            <h2 id="user-modal-title">
              {mode === "edit" ? "Atualizar acesso" : "Cadastrar acesso"}
            </h2>
            <p>Organize quem pode operar o sistema e acompanhar os pedidos.</p>
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
              <p className="eyebrow">Acesso</p>
              <h3>Dados do usuario</h3>
            </div>

            <label>
              Nome
              <input
                autoFocus
                onChange={(event) => updateForm("name", event.target.value)}
                placeholder="Ex.: Ana Martins"
                required
                value={form.name}
              />
            </label>

            <label>
              Email
              <input
                onChange={(event) => updateForm("email", event.target.value)}
                placeholder="ana@empresa.com"
                required
                type="email"
                value={form.email}
              />
            </label>

            <label>
              {mode === "edit" ? "Nova senha" : "Senha"}
              <input
                onChange={(event) => updateForm("password", event.target.value)}
                placeholder={mode === "edit" ? "Deixe em branco para manter" : "Digite a senha"}
                type="password"
                value={form.password}
              />
            </label>

            <div className="form-actions">
              <button className="secondary-button" onClick={onClose} type="button">
                Cancelar
              </button>
              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting
                  ? "Salvando..."
                  : mode === "edit"
                    ? "Salvar alteracoes"
                    : "Cadastrar usuario"}
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
