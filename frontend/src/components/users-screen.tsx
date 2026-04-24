"use client";

import { AppFrame } from "@/components/app-frame";
import { useSession } from "@/hooks/use-session";
import { useUsers } from "@/hooks/use-users";

export function UsersScreen() {
  const { session } = useSession({ requireAuth: true });
  const { ready, source, users } = useUsers();
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

  return (
    <AppFrame>
      <section className="page-header">
        <p className="eyebrow">Usuarios</p>
        <h1>Equipe</h1>
        <p>Veja quem acompanha o painel e a operacao comercial.</p>
      </section>

      <section className="summary-strip" aria-label="Origem dos dados de usuarios">
        <span>{visibleUsers.length} usuarios exibidos</span>
        <span>{source === "api" ? "Dados vindos da API" : "Exibindo base local"}</span>
        <span>{ready ? "Painel pronto" : "Carregando equipe"}</span>
      </section>

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
          </article>
        ))}
      </section>
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
