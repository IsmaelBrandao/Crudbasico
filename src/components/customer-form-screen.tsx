"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppFrame } from "@/components/app-frame";
import { CustomerModal } from "@/components/customer-modal";
import { useCustomers } from "@/hooks/use-customers";
import { Customer } from "@/lib/customers";

type CustomerFormScreenProps = {
  mode: "create" | "edit";
};

export function CustomerFormScreen({ mode }: CustomerFormScreenProps) {
  const router = useRouter();
  const { addCustomer, customers, ready, updateCustomer } = useCustomers();
  const [activeCustomer, setActiveCustomer] = useState<Customer | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("Preencha os dados principais.");
  const [loadedCustomerId, setLoadedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    if (mode === "create" || !ready || loadedCustomerId) {
      return;
    }

    let isMounted = true;

    queueMicrotask(() => {
      if (!isMounted) {
        return;
      }

      const id = new URLSearchParams(window.location.search).get("id");
      const customer = customers.find((item) => item.id === id);

      if (!id || !customer) {
        setMessage("Cliente nao encontrado. Volte para a carteira.");
        setLoadedCustomerId("missing");
        return;
      }

      setEditingId(id);
      setActiveCustomer(customer);
      setLoadedCustomerId(id);
      setMessage(`Editando ${customer.name}.`);
    });

    return () => {
      isMounted = false;
    };
  }, [customers, loadedCustomerId, mode, ready]);

  return (
    <AppFrame>
      <section className="center-panel">
        <div className="panel-card slim-card">
          <p className="eyebrow">{mode === "edit" ? "Edicao" : "Cadastro"}</p>
          <h1>{mode === "edit" ? "Abrindo edicao..." : "Abrindo cadastro..."}</h1>
          <p>{message}</p>
        </div>
      </section>

      <CustomerModal
        customer={activeCustomer}
        mode={mode}
        onClose={() => router.push("/clientes")}
        onSubmit={(form) => {
          if (mode === "edit" && editingId) {
            updateCustomer(editingId, form);
          } else {
            addCustomer(form);
          }

          router.push("/clientes");
        }}
        open={mode === "create" || Boolean(activeCustomer)}
      />
    </AppFrame>
  );
}
