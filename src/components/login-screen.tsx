"use client";

import { FormEvent, useState } from "react";
import { Brand } from "@/components/brand";
import { useSession } from "@/hooks/use-session";

export function LoginScreen() {
  const { login } = useSession({ redirectIfAuthenticated: true });
  const [company, setCompany] = useState("Nexo Comercial");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("Entre para continuar sua rotina.");

  function handleIdentify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.includes("@")) {
      setMessage("Informe seu nome e um email valido.");
      return;
    }

    setMessage("Agora confirme sua senha de acesso.");
    setStep(2);
  }

  function handleAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 4) {
      setMessage("Use uma senha com pelo menos 4 caracteres.");
      return;
    }

    login({
      company: company.trim() || "Minha empresa",
      email: email.trim(),
      name: name.trim(),
    });
  }

  return (
    <main className="login-shell">
      <section className="login-copy">
        <Brand />
        <div>
          <p className="eyebrow">Acesso seguro</p>
          <h1>Uma entrada limpa para sua carteira comercial.</h1>
          <p>
            Organize clientes, negociações e proximos contatos sem misturar tudo
            em uma unica tela.
          </p>
        </div>
        <div className="login-benefits">
          <span>Fluxo por etapas</span>
          <span>Dados salvos no navegador</span>
          <span>Pronto para Render</span>
        </div>
      </section>

      <section className="login-card" aria-labelledby="login-title">
        <div className="stepper" aria-label="Etapas do login">
          <span className={step === 1 ? "step-dot active" : "step-dot"}>1</span>
          <span />
          <span className={step === 2 ? "step-dot active" : "step-dot"}>2</span>
        </div>

        <p className="eyebrow">{step === 1 ? "Etapa 1" : "Etapa 2"}</p>
        <h2 id="login-title">
          {step === 1 ? "Identifique seu perfil" : "Confirme o acesso"}
        </h2>

        {step === 1 ? (
          <form className="stack-form" onSubmit={handleIdentify}>
            <label>
              Seu nome
              <input
                autoComplete="name"
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex.: Ismael Brandao"
                required
                value={name}
              />
            </label>
            <label>
              Email de acesso
              <input
                autoComplete="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="voce@email.com"
                required
                type="email"
                value={email}
              />
            </label>
            <label>
              Empresa
              <input
                autoComplete="organization"
                onChange={(event) => setCompany(event.target.value)}
                placeholder="Nome da empresa"
                value={company}
              />
            </label>
            <button className="primary-button" type="submit">
              Continuar
            </button>
          </form>
        ) : (
          <form className="stack-form" onSubmit={handleAccess}>
            <div className="login-summary">
              <strong>{name}</strong>
              <span>{email}</span>
            </div>
            <label>
              Senha
              <input
                autoComplete="current-password"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite qualquer senha para o prototipo"
                required
                type="password"
                value={password}
              />
            </label>
            <div className="form-actions">
              <button className="secondary-button" onClick={() => setStep(1)} type="button">
                Voltar
              </button>
              <button className="primary-button" type="submit">
                Entrar no painel
              </button>
            </div>
          </form>
        )}

        <p className="form-message" aria-live="polite">
          {message}
        </p>
      </section>
    </main>
  );
}
