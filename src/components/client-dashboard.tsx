"use client";

import {
  FormEvent,
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";

type ClientStatus = "Ativo" | "Prospect" | "Pausado";
type StatusFilter = "Todos" | ClientStatus;

type Customer = {
  company: string;
  email: string;
  id: string;
  name: string;
  notes: string;
  phone: string;
  status: ClientStatus;
  updatedAt: string;
  value: number;
};

type CustomerForm = Omit<Customer, "id" | "updatedAt">;

const STORAGE_KEY = "nexo-clientes-v1";

const emptyForm: CustomerForm = {
  company: "",
  email: "",
  name: "",
  notes: "",
  phone: "",
  status: "Prospect",
  value: 0,
};

const seedCustomers: Customer[] = [
  {
    company: "Atelie Aurora",
    email: "marina@atelieaurora.com.br",
    id: "cli-aurora",
    name: "Marina Costa",
    notes: "Quer renovar a vitrine online ainda este mês.",
    phone: "(11) 99921-4410",
    status: "Ativo",
    updatedAt: "2026-04-18T10:30:00.000Z",
    value: 8200,
  },
  {
    company: "Verde Campo Foods",
    email: "rafael@verdecampo.com.br",
    id: "cli-verde",
    name: "Rafael Nunes",
    notes: "Enviar proposta com plano trimestral e suporte dedicado.",
    phone: "(31) 98842-1120",
    status: "Prospect",
    updatedAt: "2026-04-16T14:10:00.000Z",
    value: 12500,
  },
  {
    company: "Casa Nomade",
    email: "sofia@casanomade.com.br",
    id: "cli-nomade",
    name: "Sofia Almeida",
    notes: "Pausou por reorganização interna. Retomar contato em maio.",
    phone: "(21) 98109-7742",
    status: "Pausado",
    updatedAt: "2026-04-12T09:00:00.000Z",
    value: 4300,
  },
];

const statusFilters: StatusFilter[] = ["Todos", "Ativo", "Prospect", "Pausado"];

const statusClassName: Record<ClientStatus, string> = {
  Ativo: "status-pill--active",
  Pausado: "status-pill--paused",
  Prospect: "status-pill--prospect",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  maximumFractionDigits: 0,
  style: "currency",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
});

function formatCurrency(value: number) {
  return currencyFormatter.format(value || 0);
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value)).replace(".", "");
}

function createId() {
  return globalThis.crypto?.randomUUID?.() ?? `cli-${Date.now()}`;
}

function normalize(value: string) {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export function ClientDashboard() {
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [hydrated, setHydrated] = useState(false);
  const [message, setMessage] = useState("Carteira pronta para hoje.");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      const storedCustomers = window.localStorage.getItem(STORAGE_KEY);

      if (storedCustomers) {
        try {
          if (isMounted) {
            setCustomers(JSON.parse(storedCustomers) as Customer[]);
          }
        } catch {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      }

      if (isMounted) {
        setHydrated(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  }, [customers, hydrated]);

  const activeCustomers = customers.filter((customer) => customer.status === "Ativo");
  const prospectCustomers = customers.filter(
    (customer) => customer.status === "Prospect",
  );
  const pausedCustomers = customers.filter((customer) => customer.status === "Pausado");
  const totalValue = customers.reduce((sum, customer) => sum + customer.value, 0);
  const filteredCustomers = customers.filter((customer) => {
    const query = normalize(deferredSearch);
    const matchesQuery =
      !query ||
      normalize(customer.name).includes(query) ||
      normalize(customer.company).includes(query) ||
      normalize(customer.email).includes(query);

    const matchesStatus =
      statusFilter === "Todos" || customer.status === statusFilter;

    return matchesQuery && matchesStatus;
  });

  function updateForm<Field extends keyof CustomerForm>(
    field: Field,
    value: CustomerForm[Field],
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  }

  function clearForm(nextMessage = "Formulário limpo.") {
    setEditingId(null);
    setForm(emptyForm);
    setMessage(nextMessage);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextCustomer = {
      ...form,
      company: form.company.trim(),
      email: form.email.trim(),
      name: form.name.trim(),
      notes: form.notes.trim(),
      phone: form.phone.trim(),
      value: Math.max(0, Number(form.value) || 0),
    };

    if (!nextCustomer.name || !nextCustomer.company || !nextCustomer.email) {
      setMessage("Preencha nome, empresa e email para salvar.");
      return;
    }

    if (!nextCustomer.email.includes("@")) {
      setMessage("Confira o email antes de salvar.");
      return;
    }

    const updatedAt = new Date().toISOString();

    if (editingId) {
      setCustomers((currentCustomers) =>
        currentCustomers.map((customer) =>
          customer.id === editingId
            ? {
                ...customer,
                ...nextCustomer,
                updatedAt,
              }
            : customer,
        ),
      );
      clearForm("Cliente atualizado com sucesso.");
      return;
    }

    setCustomers((currentCustomers) => [
      {
        ...nextCustomer,
        id: createId(),
        updatedAt,
      },
      ...currentCustomers,
    ]);
    clearForm("Novo cliente entrou na carteira.");
  }

  function handleEdit(customer: Customer) {
    setEditingId(customer.id);
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
    document
      .getElementById("novo-cliente")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleDelete(customer: Customer) {
    const shouldDelete = window.confirm(
      `Remover ${customer.name} da carteira de clientes?`,
    );

    if (!shouldDelete) {
      return;
    }

    setCustomers((currentCustomers) =>
      currentCustomers.filter((item) => item.id !== customer.id),
    );

    if (editingId === customer.id) {
      setEditingId(null);
      setForm(emptyForm);
    }

    setMessage(`${customer.name} foi removido.`);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
  }

  function handleStatusFilterChange(value: StatusFilter) {
    startTransition(() => {
      setStatusFilter(value);
    });
  }

  return (
    <main className="app-shell">
      <header className="site-header" aria-label="Navegação principal">
        <a className="brand" href="#topo" aria-label="Nexo Clientes">
          <span className="brand-mark">N</span>
          <span>
            <strong>Nexo</strong>
            <small>Clientes</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Seções">
          <a href="#clientes">Clientes</a>
          <a href="#novo-cliente">Novo cadastro</a>
        </nav>
      </header>

      <section className="hero" id="topo">
        <div className="hero-copy">
          <p className="eyebrow">Carteira comercial</p>
          <h1>Clientes, oportunidades e próximos contatos em um só lugar.</h1>
          <p className="hero-text">
            Organize sua base, acompanhe valores em aberto e mantenha cada
            conversa pronta para a próxima ação.
          </p>
          <div className="cta-row">
            <a className="primary-button" href="#novo-cliente">
              Adicionar cliente
            </a>
            <a className="secondary-button" href="#clientes">
              Ver carteira
            </a>
          </div>
        </div>

        <aside className="hero-card" aria-label="Resumo da carteira">
          <div className="hero-card__top">
            <span>Receita prevista</span>
            <strong>{formatCurrency(totalValue)}</strong>
          </div>
          <div className="pipeline">
            <div className="pipeline-row">
              <span>Ativos</span>
              <div className="pipeline-track">
                <span
                  className="pipeline-fill pipeline-fill--active"
                  style={{
                    width: `${Math.min(100, activeCustomers.length * 28 + 18)}%`,
                  }}
                />
              </div>
              <b>{activeCustomers.length}</b>
            </div>
            <div className="pipeline-row">
              <span>Prospects</span>
              <div className="pipeline-track">
                <span
                  className="pipeline-fill pipeline-fill--prospect"
                  style={{
                    width: `${Math.min(100, prospectCustomers.length * 28 + 18)}%`,
                  }}
                />
              </div>
              <b>{prospectCustomers.length}</b>
            </div>
            <div className="pipeline-row">
              <span>Pausados</span>
              <div className="pipeline-track">
                <span
                  className="pipeline-fill pipeline-fill--paused"
                  style={{
                    width: `${Math.min(100, pausedCustomers.length * 28 + 18)}%`,
                  }}
                />
              </div>
              <b>{pausedCustomers.length}</b>
            </div>
          </div>
        </aside>
      </section>

      <section className="metrics-grid" aria-label="Indicadores">
        <article className="metric-card">
          <span>Total na base</span>
          <strong>{customers.length}</strong>
          <small>cadastros salvos</small>
        </article>
        <article className="metric-card">
          <span>Clientes ativos</span>
          <strong>{activeCustomers.length}</strong>
          <small>em acompanhamento</small>
        </article>
        <article className="metric-card">
          <span>Em negociação</span>
          <strong>{prospectCustomers.length}</strong>
          <small>próximos fechamentos</small>
        </article>
        <article className="metric-card metric-card--accent">
          <span>Valor mapeado</span>
          <strong>{formatCurrency(totalValue)}</strong>
          <small>na carteira atual</small>
        </article>
      </section>

      <div className="workspace">
        <section className="form-card" id="novo-cliente" aria-labelledby="form-title">
          <div className="section-heading">
            <p className="eyebrow">Cadastro</p>
            <h2 id="form-title">
              {editingId ? "Atualizar cliente" : "Novo cliente"}
            </h2>
          </div>

          <form className="client-form" onSubmit={handleSubmit}>
            <label>
              Nome do contato
              <input
                autoComplete="name"
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
              Observações
              <textarea
                onChange={(event) => updateForm("notes", event.target.value)}
                placeholder="Ex.: prefere contato pela manhã, enviar proposta revisada..."
                rows={4}
                value={form.notes}
              />
            </label>

            <div className="form-actions">
              <button className="primary-button" type="submit">
                {editingId ? "Salvar alterações" : "Cadastrar cliente"}
              </button>
              <button
                className="ghost-button"
                onClick={() => clearForm()}
                type="button"
              >
                Limpar
              </button>
            </div>

            <p className="form-message" aria-live="polite">
              {message}
            </p>
          </form>
        </section>

        <section className="client-list" id="clientes" aria-labelledby="list-title">
          <div className="section-heading section-heading--row">
            <div>
              <p className="eyebrow">Relacionamento</p>
              <h2 id="list-title">Carteira de clientes</h2>
            </div>
            <span className="save-badge">
              {hydrated ? "Salvo neste navegador" : "Carregando dados"}
            </span>
          </div>

          <div className="toolbar">
            <label className="search-box">
              Buscar
              <input
                onChange={(event) => handleSearchChange(event.target.value)}
                placeholder="Nome, empresa ou email"
                type="search"
                value={search}
              />
            </label>

            <div className="filter-group" role="tablist" aria-label="Filtrar status">
              {statusFilters.map((status) => (
                <button
                  aria-selected={statusFilter === status}
                  className="filter-button"
                  key={status}
                  onClick={() => handleStatusFilterChange(status)}
                  role="tab"
                  type="button"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="cards-grid">
            {filteredCustomers.map((customer) => (
              <article className="customer-card" key={customer.id}>
                <div className="customer-card__header">
                  <div>
                    <h3>{customer.name}</h3>
                    <p>{customer.company}</p>
                  </div>
                  <span className={`status-pill ${statusClassName[customer.status]}`}>
                    {customer.status}
                  </span>
                </div>

                <dl className="customer-details">
                  <div>
                    <dt>Email</dt>
                    <dd>{customer.email}</dd>
                  </div>
                  <div>
                    <dt>Telefone</dt>
                    <dd>{customer.phone || "Não informado"}</dd>
                  </div>
                  <div>
                    <dt>Valor</dt>
                    <dd>{formatCurrency(customer.value)}</dd>
                  </div>
                  <div>
                    <dt>Atualizado</dt>
                    <dd>{formatDate(customer.updatedAt)}</dd>
                  </div>
                </dl>

                <p className="customer-note">
                  {customer.notes || "Sem observações por enquanto."}
                </p>

                <div className="card-actions">
                  <button
                    className="ghost-button"
                    onClick={() => handleEdit(customer)}
                    type="button"
                  >
                    Editar
                  </button>
                  <button
                    className="danger-button"
                    onClick={() => handleDelete(customer)}
                    type="button"
                  >
                    Remover
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredCustomers.length === 0 ? (
            <div className="empty-state">
              <strong>Nenhum cliente encontrado.</strong>
              <span>Ajuste a busca ou cadastre uma nova oportunidade.</span>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
