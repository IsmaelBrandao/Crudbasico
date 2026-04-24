"use client";

import { useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { OrderModal } from "@/components/order-modal";
import { useOrders } from "@/hooks/use-orders";
import { useProducts } from "@/hooks/use-products";
import { useUsers } from "@/hooks/use-users";
import { formatCurrency, formatDate } from "@/lib/commercial-format";
import { getOrderSummary, getOrderTotal, Order, OrderForm, orderStatusClassName } from "@/lib/orders";

export function OrdersScreen() {
  const { addOrder, orders, ready, removeOrder, source, updateOrder } = useOrders();
  const { products, ready: productsReady, source: productsSource } = useProducts();
  const { ready: usersReady, source: usersSource, users } = useUsers();
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [feedback, setFeedback] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const summary = getOrderSummary(orders);
  const relationsReady = usersReady && productsReady;
  const orderUsesApi = source === "api";
  const hasApiRelations = usersSource === "api" && productsSource === "api";
  const canManageOrders =
    ready &&
    relationsReady &&
    users.length > 0 &&
    products.length > 0 &&
    (!orderUsesApi || hasApiRelations);

  async function handleSubmit(form: OrderForm) {
    const relations = { products, users };

    if (modalMode === "edit" && activeOrder) {
      await updateOrder(activeOrder.id, form, relations);
      setFeedback("Pedido atualizado com sucesso.");
    } else {
      await addOrder(form, relations);
      setFeedback("Pedido cadastrado com sucesso.");
    }

    closeModal();
  }

  async function handleDelete(order: Order) {
    const shouldDelete = window.confirm(`Remover o pedido ${order.code}?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await removeOrder(order.id);
      setFeedback("Pedido removido com sucesso.");
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Nao foi possivel remover o pedido.",
      );
    }
  }

  function closeModal() {
    setActiveOrder(null);
    setModalMode(null);
  }

  return (
    <AppFrame>
      <section className="page-header">
        <div>
          <p className="eyebrow">Pedidos</p>
          <h1>Operacao</h1>
          <p>Monitore cada pedido, o responsavel e o valor movimentado.</p>
        </div>
        <button
          className="primary-button"
          disabled={!canManageOrders}
          onClick={() => setModalMode("create")}
          type="button"
        >
          Novo pedido
        </button>
      </section>

      <section className="overview-grid" aria-label="Resumo de pedidos">
        <MetricCard label="Pedidos" sublabel="registrados" value={String(summary.totalOrders)} />
        <MetricCard label="Confirmados" sublabel="prontos para entrega" value={String(summary.confirmed.length)} />
        <MetricCard accent label="Valor total" sublabel="em pedidos" value={formatCurrency(summary.totalRevenue)} />
      </section>

      <section className="summary-strip" aria-label="Fluxo operacional">
        <div className="stat-chip">
          <strong>{summary.totalOrders}</strong>
          <span>pedidos</span>
        </div>
        {summary.preparing.length > 0 && (
          <div className="stat-chip">
            <strong>{summary.preparing.length}</strong>
            <span>em preparo</span>
          </div>
        )}
        {summary.pending.length > 0 && (
          <div className="stat-chip stat-chip--alert">
            <strong>{summary.pending.length}</strong>
            <span>pendentes</span>
          </div>
        )}
        {summary.confirmed.length > 0 && (
          <div className="stat-chip stat-chip--ok">
            <strong>{summary.confirmed.length}</strong>
            <span>confirmados</span>
          </div>
        )}
      </section>

      {!canManageOrders && ready ? (
        <div className="empty-state">
          <strong>Cadastre usuarios e produtos primeiro</strong>
          <span>Os pedidos precisam de usuarios e produtos cadastrados para funcionar.</span>
        </div>
      ) : null}

      {feedback ? (
        <p className="form-message" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <section className="cards-grid">
        {orders.map((order) => (
          <article className="record-card" key={order.id}>
            <div className="record-card__header">
              <div>
                <h3>{order.code}</h3>
                <p>{order.userName}</p>
              </div>
              <span className={`status-pill ${orderStatusClassName[order.status]}`}>
                {order.status}
              </span>
            </div>

            <dl className="record-details">
              <div>
                <dt>Produto</dt>
                <dd>{order.productName}</dd>
              </div>
              <div>
                <dt>Quantidade</dt>
                <dd>{order.quantity} un.</dd>
              </div>
              <div>
                <dt>Total</dt>
                <dd>{formatCurrency(getOrderTotal(order))}</dd>
              </div>
              <div>
                <dt>Data</dt>
                <dd>{formatDate(order.createdAt)}</dd>
              </div>
            </dl>

            <p className="record-note">Responsavel: {order.owner}</p>

            <div className="card-actions">
              <button
                className="ghost-button"
                onClick={() => {
                  setActiveOrder(order);
                  setModalMode("edit");
                }}
                type="button"
              >
                Editar
              </button>
              <button
                className="danger-button"
                onClick={() => handleDelete(order)}
                type="button"
              >
                Remover
              </button>
            </div>
          </article>
        ))}
      </section>

      {orders.length === 0 && canManageOrders ? (
        <div className="empty-state">
          <strong>Nenhum pedido registrado</strong>
          <span>Crie o primeiro pedido para comecar a acompanhar a operacao.</span>
        </div>
      ) : null}

      <OrderModal
        mode={modalMode ?? "create"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        open={modalMode !== null}
        order={activeOrder}
        products={products}
        users={users}
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
