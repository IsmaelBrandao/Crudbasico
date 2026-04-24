"use client";

import { useEffect, useRef, useState } from "react";
import { DataSource, deleteApi, fetchApiJson, postApiJson, putApiJson } from "@/lib/api";
import { Product } from "@/lib/products";
import {
  ApiOrder,
  createLocalOrder,
  mapApiOrder,
  mapOrderToApiInput,
  Order,
  OrderForm,
  seedOrders,
  updateLocalOrder,
} from "@/lib/orders";
import { UserCard } from "@/lib/users";

type OrderRelations = {
  products: Product[];
  users: UserCard[];
};

export function useOrders() {
  const ordersRef = useRef<Order[]>(seedOrders);
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<DataSource>("local");

  useEffect(() => {
    let isMounted = true;

    async function loadOrders() {
      try {
        const apiOrders = await fetchApiJson<ApiOrder[]>("/pedidos");

        if (!isMounted) {
          return;
        }

        const mappedOrders = apiOrders.map(mapApiOrder);

        ordersRef.current = mappedOrders;
        setOrders(mappedOrders);
        setSource("api");
      } catch {
        if (!isMounted) {
          return;
        }

        ordersRef.current = seedOrders;
        setOrders(seedOrders);
        setSource("local");
      } finally {
        if (isMounted) {
          setReady(true);
        }
      }
    }

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  function commitOrders(nextOrders: Order[]) {
    ordersRef.current = nextOrders;
    setOrders(nextOrders);
  }

  async function addOrder(form: OrderForm, relations: OrderRelations) {
    if (source === "api") {
      const createdOrder = await postApiJson<ApiOrder, ReturnType<typeof mapOrderToApiInput>>(
        "/pedidos",
        mapOrderToApiInput(form),
      );
      const mappedOrder = mapApiOrder(createdOrder);

      commitOrders([mappedOrder, ...ordersRef.current]);
      return mappedOrder;
    }

    const localOrder = createLocalOrder(form, relations.users, relations.products);

    commitOrders([localOrder, ...ordersRef.current]);
    return localOrder;
  }

  async function updateOrder(id: string, form: OrderForm, relations: OrderRelations) {
    if (source === "api") {
      const updatedOrder = await putApiJson<ApiOrder, ReturnType<typeof mapOrderToApiInput>>(
        `/pedidos/${id}`,
        mapOrderToApiInput(form),
      );
      const mappedOrder = mapApiOrder(updatedOrder);

      commitOrders(ordersRef.current.map((order) => (order.id === id ? mappedOrder : order)));
      return mappedOrder;
    }

    commitOrders(
      ordersRef.current.map((order) =>
        order.id === id ? updateLocalOrder(order, form, relations.users, relations.products) : order,
      ),
    );
  }

  async function removeOrder(id: string) {
    if (source === "api") {
      await deleteApi(`/pedidos/${id}`);
    }

    commitOrders(ordersRef.current.filter((order) => order.id !== id));
  }

  return {
    addOrder,
    orders,
    ready,
    removeOrder,
    source,
    updateOrder,
  };
}
