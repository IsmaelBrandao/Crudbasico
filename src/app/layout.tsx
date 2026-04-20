import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-display",
  weight: "variable",
});

const body = Manrope({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-body",
  weight: "variable",
});

export const metadata: Metadata = {
  title: "Nexo Clientes",
  description: "Carteira de clientes para acompanhar contatos, valores e retornos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
