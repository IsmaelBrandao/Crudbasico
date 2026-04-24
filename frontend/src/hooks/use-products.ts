"use client";

import { useEffect, useState } from "react";
import { DataSource, fetchApiJson } from "@/lib/api";
import { ApiProduct, mapApiProduct, Product, seedProducts } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<DataSource>("local");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const apiProducts = await fetchApiJson<ApiProduct[]>("/produtos");

        if (!isMounted) {
          return;
        }

        setProducts(apiProducts.map(mapApiProduct));
        setSource("api");
      } catch {
        if (!isMounted) {
          return;
        }

        setProducts(seedProducts);
        setSource("local");
      } finally {
        if (isMounted) {
          setReady(true);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    products,
    ready,
    source,
  };
}
