"use client";

import { useEffect, useRef, useState } from "react";
import {
  createCustomerId,
  CUSTOMER_STORAGE_KEY,
  Customer,
  CustomerForm,
  seedCustomers,
} from "@/lib/customers";

function parseStoredCustomers() {
  const storedCustomers = window.localStorage.getItem(CUSTOMER_STORAGE_KEY);

  if (!storedCustomers) {
    return seedCustomers;
  }

  try {
    return JSON.parse(storedCustomers) as Customer[];
  } catch {
    window.localStorage.removeItem(CUSTOMER_STORAGE_KEY);
    return seedCustomers;
  }
}

export function useCustomers() {
  const customersRef = useRef<Customer[]>(seedCustomers);
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      const storedCustomers = parseStoredCustomers();
      customersRef.current = storedCustomers;
      setCustomers(storedCustomers);
      setReady(true);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    customersRef.current = customers;

    if (!ready) {
      return;
    }

    window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(customers));
  }, [customers, ready]);

  function commitCustomers(nextCustomers: Customer[]) {
    customersRef.current = nextCustomers;
    setCustomers(nextCustomers);

    if (ready) {
      window.localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify(nextCustomers),
      );
    }
  }

  function addCustomer(form: CustomerForm) {
    const customer: Customer = {
      ...form,
      id: createCustomerId(),
      updatedAt: new Date().toISOString(),
      value: Math.max(0, Number(form.value) || 0),
    };

    commitCustomers([customer, ...customersRef.current]);
    return customer;
  }

  function updateCustomer(id: string, form: CustomerForm) {
    const updatedAt = new Date().toISOString();

    commitCustomers(
      customersRef.current.map((customer) =>
        customer.id === id
          ? {
              ...customer,
              ...form,
              updatedAt,
              value: Math.max(0, Number(form.value) || 0),
            }
          : customer,
      ),
    );
  }

  function removeCustomer(id: string) {
    commitCustomers(
      customersRef.current.filter((customer) => customer.id !== id),
    );
  }

  return {
    addCustomer,
    customers,
    ready,
    removeCustomer,
    updateCustomer,
  };
}
