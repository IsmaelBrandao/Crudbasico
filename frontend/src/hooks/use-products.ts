"use client";

import { useEffect, useState } from "react";
import { Product, seedProducts } from "@/lib/products";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(seedProducts);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      setProducts(seedProducts);
      setReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    products,
    ready,
  };
}
