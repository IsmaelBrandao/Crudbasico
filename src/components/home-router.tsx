"use client";

import { useSession } from "@/hooks/use-session";

export function HomeRouter() {
  useSession({ redirectIfAuthenticated: true, requireAuth: true });

  return (
    <main className="app-shell">
      <section className="center-panel">
        <div className="panel-card slim-card">
          <p className="eyebrow">Nexo Clientes</p>
          <h1>Redirecionando...</h1>
          <p>Estamos abrindo sua area de trabalho.</p>
        </div>
      </section>
    </main>
  );
}
