"use client";

import { useEffect, useState } from "react";
import { Order, seedOrders } from "@/lib/orders";

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(seedOrders);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      setOrders(seedOrders);
      setReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    orders,
    ready,
  };
}
