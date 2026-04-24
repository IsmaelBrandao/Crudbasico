"use client";

import { useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { useSession } from "@/hooks/use-session";
import { UserModal } from "@/components/user-modal";
import { useUsers } from "@/hooks/use-users";
import { UserCard, UserForm } from "@/lib/users";

export function UsersScreen() {
  const { session } = useSession({ requireAuth: true });
  const { addUser, ready, removeUser, source, updateUser, users } = useUsers();
  const [activeUser, setActiveUser] = useState<UserCard | null>(null);
  const [feedback, setFeedback] = useState("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const sessionUser = session
    ? {
        email: session.email,
        id: "session-user",
        name: session.name,
        role: "Administrador",
        status: "Ativo",
      }
    : null;
  const visibleUsers =
    sessionUser && !users.some((user) => user.email === sessionUser.email)
      ? [sessionUser, ...users]
      : users;

  async function handleSubmit(form: UserForm) {
    if (modalMode === "edit" && activeUser) {
      await updateUser(activeUser.id, form);
      setFeedback("Usuario atualizado com sucesso.");
    } else {
      await addUser(form);
      setFeedback("Usuario cadastrado com sucesso.");
    }

    closeModal();
  }

  async function handleDelete(user: UserCard) {
    const shouldDelete = window.confirm(`Remover ${user.name} da equipe?`);

    if (!shouldDelete) {
      return;
    }

    try {
      await removeUser(user.id);
      setFeedback("Usuario removido com sucesso.");
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Nao foi possivel remover o usuario.",
      );
    }
  }

  function closeModal() {
    setActiveUser(null);
    setModalMode(null);
  }

  return (
    <AppFrame>
      <section className="page-header">
        <div>
          <p className="eyebrow">Usuarios</p>
          <h1>Equipe</h1>
          <p>Veja quem acompanha o painel e a operacao comercial.</p>
        </div>
        <button className="primary-button" onClick={() => setModalMode("create")} type="button">
          Novo usuario
        </button>
      </section>

      <section className="summary-strip" aria-label="Origem dos dados de usuarios">
        <span>{visibleUsers.length} usuarios exibidos</span>
        <span>{source === "api" ? "Dados vindos da API" : "Exibindo base local"}</span>
        <span>{ready ? "Painel pronto" : "Carregando equipe"}</span>
      </section>

      {feedback ? (
        <p className="form-message" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <section className="users-grid">
        {visibleUsers.map((user) => (
          <article className="user-card" key={user.email}>
            <span className="user-avatar">{getInitials(user.name)}</span>
            <div>
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <div className="user-card__meta">
              <span>{user.role}</span>
              <strong>{user.status}</strong>
            </div>
            {user.id !== "session-user" ? (
              <div className="card-actions">
                <button
                  className="ghost-button"
                  onClick={() => {
                    setActiveUser(user);
                    setModalMode("edit");
                  }}
                  type="button"
                >
                  Editar
                </button>
                <button
                  className="danger-button"
                  onClick={() => handleDelete(user)}
                  type="button"
                >
                  Remover
                </button>
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <UserModal
        mode={modalMode ?? "create"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        open={modalMode !== null}
        source={source}
        user={activeUser}
      />
    </AppFrame>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
