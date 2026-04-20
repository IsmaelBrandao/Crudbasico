"use client";

import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { AppFrame } from "@/components/app-frame";
import { CustomerModal } from "@/components/customer-modal";
import { useCustomers } from "@/hooks/use-customers";
import {
  Customer,
  CustomerForm,
  formatCurrency,
  formatDate,
  getCustomerSummary,
  normalize,
  statusClassName,
  statusFilters,
  StatusFilter,
} from "@/lib/customers";

export function CustomersScreen() {
  const { addCustomer, customers, ready, removeCustomer, updateCustomer } =
    useCustomers();
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");
  const deferredSearch = useDeferredValue(search);
  const summary = getCustomerSummary(customers);
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

  useEffect(() => {
    if (!ready || modalMode) {
      return;
    }

    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const newCustomer = params.get("new");
      const editCustomerId = params.get("edit");

      if (newCustomer === "1") {
        setModalMode("create");
        window.history.replaceState(null, "", window.location.pathname);
        return;
      }

      if (editCustomerId) {
        const customer = customers.find((item) => item.id === editCustomerId);

        if (customer) {
          setActiveCustomer(customer);
          setModalMode("edit");
        }

        window.history.replaceState(null, "", window.location.pathname);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [customers, modalMode, ready]);

  function handleStatusFilterChange(value: StatusFilter) {
    startTransition(() => {
      setStatusFilter(value);
    });
  }

  function handleDelete(customer: Customer) {
    const shouldDelete = window.confirm(
      `Remover ${customer.name} da carteira de clientes?`,
    );

    if (shouldDelete) {
      removeCustomer(customer.id);
    }
  }

  function handleModalSubmit(form: CustomerForm) {
    if (modalMode === "edit" && activeCustomer) {
      updateCustomer(activeCustomer.id, form);
    } else {
      addCustomer(form);
    }

    closeModal();
  }

  function closeModal() {
    setModalMode(null);
    setActiveCustomer(null);
  }

  return (
    <AppFrame>
      <section className="page-title-row">
        <div>
          <p className="eyebrow">Carteira</p>
          <h1>Clientes</h1>
          <p>Encontre contatos, atualize dados e acompanhe cada negociacao.</p>
        </div>
        <button
          className="primary-button"
          onClick={() => setModalMode("create")}
          type="button"
        >
          Novo cliente
        </button>
      </section>

      <section className="toolbar">
        <label className="search-box">
          Buscar
          <input
            onChange={(event) => setSearch(event.target.value)}
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
      </section>

      <section className="summary-strip" aria-label="Resumo da carteira">
        <span>{summary.totalCustomers} clientes</span>
        <span>{summary.active.length} ativos</span>
        <span>{formatCurrency(summary.totalValue)} mapeados</span>
        <span>{ready ? "Salvo neste aparelho" : "Carregando dados"}</span>
      </section>

      <section className="cards-grid">
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
                <dd>{customer.phone || "Nao informado"}</dd>
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
              {customer.notes || "Sem observacoes por enquanto."}
            </p>

            <div className="card-actions">
              <button
                className="ghost-button"
                onClick={() => {
                  setActiveCustomer(customer);
                  setModalMode("edit");
                }}
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
      </section>

      {filteredCustomers.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhum cliente encontrado.</strong>
          <span>Ajuste a busca ou adicione um novo cliente.</span>
        </div>
      ) : null}

      <CustomerModal
        customer={activeCustomer}
        mode={modalMode ?? "create"}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
        open={modalMode !== null}
      />
    </AppFrame>
  );
}
