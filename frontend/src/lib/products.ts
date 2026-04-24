export type Product = {
  category: string;
  description: string;
  id: string;
  image?: string;
  name: string;
  price: number;
  stock: number;
  updatedAt: string;
};

export type ProductForm = {
  name: string;
  price: number;
  stock: number;
};

export type ApiProduct = {
  createdAt?: string;
  estoque: number;
  id: number;
  nome: string;
  preco: number | string;
  updatedAt?: string;
};

export type ProductAvailability = "Disponivel" | "Baixo" | "Sem estoque";

const CATEGORY_IMAGES: Record<string, string> = {
  Acessorios:
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
  Cabos:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
  Fones:
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
  Monitores:
    "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80",
  Notebooks:
    "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
  Perifericos:
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
  Smartphones:
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
};

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80";

export function getProductImage(product: Product): string {
  if (product.image?.trim()) return product.image;
  return CATEGORY_IMAGES[product.category] ?? DEFAULT_PRODUCT_IMAGE;
}

export const seedProducts: Product[] = [
  {
    category: "Perifericos",
    description: "Teclado mecanico com perfil comercial e suporte dedicado para revenda.",
    id: "prod-teclado",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
    name: "Teclado mecanico",
    price: 199.9,
    stock: 14,
    updatedAt: "2026-04-22T09:30:00.000Z",
  },
  {
    category: "Monitores",
    description: "Monitor ultrawide usado no pacote premium do catalogo comercial.",
    id: "prod-monitor",
    image:
      "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=600&q=80",
    name: "Monitor ultrawide",
    price: 1499,
    stock: 4,
    updatedAt: "2026-04-21T15:10:00.000Z",
  },
  {
    category: "Acessorios",
    description: "Mouse sem fio com reposicao pendente para a proxima semana.",
    id: "prod-mouse",
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80",
    name: "Mouse sem fio",
    price: 129.9,
    stock: 0,
    updatedAt: "2026-04-20T11:45:00.000Z",
  },
];

export const emptyProductForm: ProductForm = {
  name: "",
  price: 0,
  stock: 0,
};

export function createProductId() {
  return globalThis.crypto?.randomUUID?.() ?? `prod-${Date.now()}`;
}

export function mapApiProduct(product: ApiProduct): Product {
  return {
    category: "Catalogo",
    description: "Item disponivel no catalogo comercial.",
    id: String(product.id),
    name: product.nome,
    price: Number(product.preco) || 0,
    stock: Number(product.estoque) || 0,
    updatedAt: product.updatedAt || product.createdAt || new Date().toISOString(),
  };
}

export function mapProductToApiInput(product: ProductForm) {
  return {
    estoque: Math.max(0, Number(product.stock) || 0),
    nome: product.name.trim(),
    preco: Math.max(0, Number(product.price) || 0),
  };
}

export function createLocalProduct(form: ProductForm): Product {
  return {
    category: "Catalogo",
    description: "Item disponivel no catalogo comercial.",
    id: createProductId(),
    name: form.name.trim(),
    price: Math.max(0, Number(form.price) || 0),
    stock: Math.max(0, Number(form.stock) || 0),
    updatedAt: new Date().toISOString(),
  };
}

export function updateLocalProduct(product: Product, form: ProductForm): Product {
  return {
    ...product,
    name: form.name.trim(),
    price: Math.max(0, Number(form.price) || 0),
    stock: Math.max(0, Number(form.stock) || 0),
    updatedAt: new Date().toISOString(),
  };
}

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
