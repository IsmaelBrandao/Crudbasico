"use client";

import { AppFrame } from "@/components/app-frame";
import { useSession } from "@/hooks/use-session";

const team = [
  {
    email: "comercial@nextcomercial.local",
    name: "Equipe Comercial",
    role: "Vendas",
    status: "Ativo",
  },
  {
    email: "atendimento@nextcomercial.local",
    name: "Atendimento",
    role: "Operacao",
    status: "Ativo",
  },
];

export function UsersScreen() {
  const { session } = useSession({ requireAuth: true });
  const users = session
    ? [
        {
          email: session.email,
          name: session.name,
          role: "Administrador",
          status: "Ativo",
        },
        ...team,
      ]
    : team;

  return (
    <AppFrame>
      <section className="page-header">
        <p className="eyebrow">Usuarios</p>
        <h1>Equipe</h1>
        <p>Veja quem acompanha o painel e a operacao comercial.</p>
      </section>

      <section className="users-grid">
        {users.map((user) => (
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
