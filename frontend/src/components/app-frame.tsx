"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brand } from "@/components/brand";
import { useSession } from "@/hooks/use-session";

const navigation = [
  { glyph: "P", href: "/dashboard", label: "Painel", note: "Visao geral" },
  { glyph: "C", href: "/clientes", label: "Clientes", note: "Carteira" },
  { glyph: "U", href: "/usuarios", label: "Usuarios", note: "Equipe" },
  { glyph: "R", href: "/relatorios", label: "Relatorios", note: "Numeros" },
];

type AppFrameProps = {
  children: React.ReactNode;
};

export function AppFrame({ children }: AppFrameProps) {
  const pathname = usePathname();
  const { logout, ready, session } = useSession({ requireAuth: true });

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <main className="app-layout">
      <aside className="app-sidebar" aria-label="Menu principal">
        <Brand />

        <nav className="side-nav">
          {navigation.map((item) => (
            <Link
              aria-current={isActive(item.href) ? "page" : undefined}
              className="side-nav__item"
              href={item.href}
              key={item.href}
            >
              <span className="nav-glyph">{item.glyph}</span>
              <span>
                <strong>{item.label}</strong>
                <small>{item.note}</small>
              </span>
            </Link>
          ))}
        </nav>

        <Link className="sidebar-action" href="/clientes?new=1">
          Novo cliente
        </Link>

        <div className="sidebar-account">
          <small>Conta</small>
          <strong>{ready && session ? session.name : "Entrando..."}</strong>
          <button className="ghost-button compact-button" onClick={logout} type="button">
            Sair
          </button>
        </div>
      </aside>

      <section className="app-main">
        <header className="mobile-topbar">
          <Brand />
          <button className="ghost-button compact-button" onClick={logout} type="button">
            Sair
          </button>
        </header>

        <div className="content-shell">{ready && session ? children : <LoadingScreen />}</div>

        <nav className="mobile-tabbar" aria-label="Menu mobile">
          {navigation.map((item) => (
            <Link
              aria-current={isActive(item.href) ? "page" : undefined}
              href={item.href}
              key={item.href}
            >
              <span>{item.glyph}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </section>
    </main>
  );
}

function LoadingScreen() {
  return (
    <section className="center-panel">
      <div className="panel-card slim-card">
        <p className="eyebrow">Conta</p>
        <h1>Preparando sua carteira...</h1>
      </div>
    </section>
  );
}
