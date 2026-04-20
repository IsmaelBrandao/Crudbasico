"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";
import { useSession } from "@/hooks/use-session";

const navigation = [
  { href: "/dashboard", label: "Painel" },
  { href: "/clientes", label: "Clientes" },
  { href: "/clientes/novo", label: "Novo cliente" },
];

type AppFrameProps = {
  children: React.ReactNode;
};

export function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname();
  const { logout, ready, session } = useSession({ requireAuth: true });

  return (
    <main className="app-shell">
      <header className="site-header" aria-label="Navegacao principal">
        <Brand />

        <nav className="nav-links" aria-label="Telas">
          {navigation.map((item) => (
            <Link
              aria-current={pathname === item.href ? "page" : undefined}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="user-menu">
          <span>{ready && session ? session.name : "Entrando..."}</span>
          <button className="ghost-button compact-button" onClick={logout} type="button">
            Sair
          </button>
        </div>
      </header>

      {ready && session ? children : <LoadingScreen />}
    </main>
  );
}

function LoadingScreen() {
  return (
    <section className="center-panel">
      <div className="panel-card slim-card">
        <p className="eyebrow">Sessao</p>
        <h1>Preparando sua carteira...</h1>
      </div>
    </section>
  );
}
