import Link from "next/link";

export function Brand() {
  return (
    <Link className="brand" href="/dashboard" aria-label="Next Comercial">
      <span className="brand-mark">N</span>
      <span>
        <strong>Next</strong>
        <small>Comercial</small>
      </span>
    </Link>
  );
}
