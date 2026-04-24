export type Product = {
  category: string;
  description: string;
  id: string;
  name: string;
  price: number;
  stock: number;
  updatedAt: string;
};

export type ProductAvailability = "Disponivel" | "Baixo" | "Sem estoque";

export const seedProducts: Product[] = [
  {
    category: "Perifericos",
    description: "Teclado mecanico com perfil comercial e suporte dedicado para revenda.",
    id: "prod-teclado",
    name: "Teclado mecanico",
    price: 199.9,
    stock: 14,
    updatedAt: "2026-04-22T09:30:00.000Z",
  },
  {
    category: "Monitores",
    description: "Monitor ultrawide usado no pacote premium do catalogo comercial.",
    id: "prod-monitor",
    name: "Monitor ultrawide",
    price: 1499,
    stock: 4,
    updatedAt: "2026-04-21T15:10:00.000Z",
  },
  {
    category: "Acessorios",
    description: "Mouse sem fio com reposicao pendente para a proxima semana.",
    id: "prod-mouse",
    name: "Mouse sem fio",
    price: 129.9,
    stock: 0,
    updatedAt: "2026-04-20T11:45:00.000Z",
  },
];

export const productStatusClassName: Record<ProductAvailability, string> = {
  Baixo: "status-pill--prospect",
  Disponivel: "status-pill--active",
  "Sem estoque": "status-pill--paused",
};

export function getProductAvailability(product: Product): ProductAvailability {
  if (product.stock <= 0) {
    return "Sem estoque";
  }

  if (product.stock <= 5) {
    return "Baixo";
  }

  return "Disponivel";
}

export function getProductSummary(products: Product[]) {
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalValue = products.reduce(
    (sum, product) => sum + product.price * product.stock,
    0,
  );
  const lowStock = products.filter((product) => product.stock > 0 && product.stock <= 5);
  const outOfStock = products.filter((product) => product.stock <= 0);

  return {
    lowStock,
    outOfStock,
    totalProducts: products.length,
    totalStock,
    totalValue,
  };
}
