import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/dashboard" aria-label="Nexo Clientes">
      <span className="brand-mark">N</span>
      <span>
        <strong>Nexo</strong>
        <small>Clientes</small>
      </span>
    </Link>
  );
}
