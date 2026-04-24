"use client";

import { useEffect, useState } from "react";
import { DataSource, fetchApiJson } from "@/lib/api";
import { ApiUser, mapApiUser, seedUsers, UserCard } from "@/lib/users";

export function useUsers() {
  const [ready, setReady] = useState(false);
  const [source, setSource] = useState<DataSource>("local");
  const [users, setUsers] = useState<UserCard[]>(seedUsers);

  useEffect(() => {
    let isMounted = true;

    async function loadUsers() {
      try {
        const apiUsers = await fetchApiJson<ApiUser[]>("/usuarios");

        if (!isMounted) {
          return;
        }

        setUsers(apiUsers.map(mapApiUser));
        setSource("api");
      } catch {
        if (!isMounted) {
          return;
        }

        setUsers(seedUsers);
        setSource("local");
      } finally {
        if (isMounted) {
          setReady(true);
        }
      }
    }

    loadUsers();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ready,
    source,
    users,
  };
}
