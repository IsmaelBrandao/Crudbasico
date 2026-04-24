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
          <h1>Acompanhamento da operacao</h1>
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
        <MetricCard label="Pedidos" value={String(summary.totalOrders)} />
        <MetricCard label="Confirmados" value={String(summary.confirmed.length)} />
        <MetricCard accent label="Valor projetado" value={formatCurrency(summary.totalRevenue)} />
      </section>

      <section className="summary-strip" aria-label="Fluxo operacional">
        <span>{summary.preparing.length} em preparo</span>
        <span>{summary.pending.length} pendentes</span>
        <span>
          {ready
            ? source === "api"
              ? "Pedidos carregados da API"
              : "Exibindo pedidos locais"
            : "Carregando pedidos"}
        </span>
      </section>

      {!canManageOrders ? (
        <div className="empty-state">
          <strong>
            {orderUsesApi
              ? "Carregue usuarios e produtos da API antes de criar pedidos."
              : "Cadastre usuarios e produtos antes de criar pedidos."}
          </strong>
          <span>
            {orderUsesApi
              ? "Pedidos da API dependem dos cadastros reais para funcionar corretamente."
              : "O pedido depende dos dois cadastros para funcionar corretamente."}
          </span>
        </div>
      ) : null}

      {feedback ? (
        <p className="form-message" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <section className="cards-grid">
        {orders.map((order) => (
          <article className="customer-card" key={order.id}>
            <div className="customer-card__header">
              <div>
                <h3>{order.code}</h3>
                <p>{order.customerName}</p>
              </div>
              <span className={`status-pill ${orderStatusClassName[order.status]}`}>
                {order.status}
              </span>
            </div>

            <dl className="customer-details">
              <div>
                <dt>Produto</dt>
                <dd>{order.productName}</dd>
              </div>
              <div>
                <dt>Quantidade</dt>
                <dd>{order.quantity}</dd>
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

            <p className="customer-note">Responsavel pelo acompanhamento: {order.owner}.</p>

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

      {orders.length === 0 ? (
        <div className="empty-state">
          <strong>Nenhum pedido cadastrado.</strong>
          <span>Crie um pedido para acompanhar a movimentacao da operacao.</span>
        </div>
      ) : null}

      <OrderModal
        mode={modalMode ?? "create"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        open={modalMode !== null}
        order={activeOrder}
        products={products}
        source={source}
        users={users}
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
      <small>operacao atual</small>
    </article>
  );
}
