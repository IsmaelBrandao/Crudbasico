"use client";

import { useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { useSession } from "@/hooks/use-session";
import { UserModal } from "@/components/user-modal";
import { useUsers } from "@/hooks/use-users";
import { UserCard, UserForm } from "@/lib/users";

const AVATAR_TONES = ["", "user-avatar--ocean", "user-avatar--fern", "user-avatar--clay"];

function getAvatarTone(name: string): string {
  return AVATAR_TONES[(name.charCodeAt(0) || 0) % AVATAR_TONES.length];
}

export function UsersScreen() {
  const { session } = useSession({ requireAuth: true });
  const { addUser, ready, removeUser, updateUser, users } = useUsers();
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
  const activeUsers = visibleUsers.filter((user) => user.status === "Ativo").length;

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
          <p>Gerencie quem tem acesso ao painel e acompanha a operacao.</p>
        </div>
        <button className="primary-button" onClick={() => setModalMode("create")} type="button">
          Novo usuario
        </button>
      </section>

      <section className="summary-strip" aria-label="Resumo da equipe">
        <div className="stat-chip">
          <strong>{visibleUsers.length}</strong>
          <span>usuarios</span>
        </div>
        <div className="stat-chip stat-chip--ok">
          <strong>{activeUsers}</strong>
          <span>ativos</span>
        </div>
        {visibleUsers.length - activeUsers > 0 && (
          <div className="stat-chip stat-chip--alert">
            <strong>{visibleUsers.length - activeUsers}</strong>
            <span>inativos</span>
          </div>
        )}
      </section>

      {feedback ? (
        <p className="form-message" aria-live="polite">
          {feedback}
        </p>
      ) : null}

      <section className="users-grid">
        {visibleUsers.map((user) => (
          <article className="user-card" key={user.email}>
            <div className="user-card__top">
              <span className={`user-avatar ${getAvatarTone(user.name)}`}>
                {getInitials(user.name)}
              </span>
              <span className={`status-pill ${user.status === "Ativo" ? "status-pill--active" : "status-pill--paused"}`}>
                {user.status}
              </span>
            </div>
            <div className="user-card__info">
              <h3>{user.name}</h3>
              <p>{user.email}</p>
            </div>
            <div className="user-card__meta">
              <span>{user.role}</span>
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
              ) : (
                <span className="user-tag">Voce</span>
              )}
            </div>
          </article>
        ))}
      </section>

      {visibleUsers.length === 0 && ready ? (
        <div className="empty-state">
          <strong>Nenhum usuario cadastrado</strong>
          <span>Adicione o primeiro membro para comecar a gerenciar a equipe.</span>
        </div>
      ) : null}

      <UserModal
        mode={modalMode ?? "create"}
        onClose={closeModal}
        onSubmit={handleSubmit}
        open={modalMode !== null}
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
