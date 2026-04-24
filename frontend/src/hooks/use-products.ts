"use client";

import { useEffect, useRef, useState } from "react";
import { DataSource, deleteApi, fetchApiJson, postApiJson, putApiJson } from "@/lib/api";
import {
  ApiProduct,
  createLocalProduct,
  mapApiProduct,
  mapProductToApiInput,
  Product,
  ProductForm,
  seedProducts,
  updateLocalProduct,
} from "@/lib/products";

export function useProducts() {
  const productsRef = useRef<Product[]>(seedProducts);
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

        const mappedProducts = apiProducts.map(mapApiProduct);

        productsRef.current = mappedProducts;
        setProducts(mappedProducts);
        setSource("api");
      } catch {
        if (!isMounted) {
          return;
        }

        productsRef.current = seedProducts;
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

  function commitProducts(nextProducts: Product[]) {
    productsRef.current = nextProducts;
    setProducts(nextProducts);
  }

  async function addProduct(form: ProductForm) {
    if (source === "api") {
      const createdProduct = await postApiJson<ApiProduct, ReturnType<typeof mapProductToApiInput>>(
        "/produtos",
        mapProductToApiInput(form),
      );
      const mappedProduct = mapApiProduct(createdProduct);

      commitProducts([mappedProduct, ...productsRef.current]);
      return mappedProduct;
    }

    const localProduct = createLocalProduct(form);

    commitProducts([localProduct, ...productsRef.current]);
    return localProduct;
  }

  async function updateProduct(id: string, form: ProductForm) {
    if (source === "api") {
      const updatedProduct = await putApiJson<ApiProduct, ReturnType<typeof mapProductToApiInput>>(
        `/produtos/${id}`,
        mapProductToApiInput(form),
      );
      const mappedProduct = mapApiProduct(updatedProduct);

      commitProducts(
        productsRef.current.map((product) => (product.id === id ? mappedProduct : product)),
      );
      return mappedProduct;
    }

    commitProducts(
      productsRef.current.map((product) =>
        product.id === id ? updateLocalProduct(product, form) : product,
      ),
    );
  }

  async function removeProduct(id: string) {
    if (source === "api") {
      await deleteApi(`/produtos/${id}`);
    }

    commitProducts(productsRef.current.filter((product) => product.id !== id));
  }

  return {
    addProduct,
    products,
    ready,
    removeProduct,
    source,
    updateProduct,
  };
}
