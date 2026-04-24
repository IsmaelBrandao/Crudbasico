"use client";

import { useEffect, useRef, useState } from "react";
import { DataSource, deleteApi, fetchApiJson, postApiJson, putApiJson } from "@/lib/api";
import {
  ApiUser,
  createLocalUser,
  mapApiUser,
  mapUserToApiInput,
  seedUsers,
  updateLocalUser,
  UserCard,
  UserForm,
} from "@/lib/users";

export function useUsers() {
  const usersRef = useRef<UserCard[]>(seedUsers);
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

        const mappedUsers = apiUsers.map(mapApiUser);

        usersRef.current = mappedUsers;
        setUsers(mappedUsers);
        setSource("api");
      } catch {
        if (!isMounted) {
          return;
        }

        usersRef.current = seedUsers;
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

  function commitUsers(nextUsers: UserCard[]) {
    usersRef.current = nextUsers;
    setUsers(nextUsers);
  }

  async function addUser(form: UserForm) {
    if (source === "api") {
      const createdUser = await postApiJson<ApiUser, ReturnType<typeof mapUserToApiInput>>(
        "/usuarios",
        mapUserToApiInput(form),
      );
      const mappedUser = mapApiUser(createdUser);

      commitUsers([mappedUser, ...usersRef.current]);
      return mappedUser;
    }

    const localUser = createLocalUser(form);

    commitUsers([localUser, ...usersRef.current]);
    return localUser;
  }

  async function updateUser(id: string, form: UserForm) {
    if (source === "api") {
      const updatedUser = await putApiJson<ApiUser, ReturnType<typeof mapUserToApiInput>>(
        `/usuarios/${id}`,
        mapUserToApiInput(form),
      );
      const mappedUser = mapApiUser(updatedUser);

      commitUsers(usersRef.current.map((user) => (user.id === id ? mappedUser : user)));
      return mappedUser;
    }

    commitUsers(
      usersRef.current.map((user) =>
        user.id === id ? updateLocalUser(user, form) : user,
      ),
    );
  }

  async function removeUser(id: string) {
    if (source === "api") {
      await deleteApi(`/usuarios/${id}`);
    }

    commitUsers(usersRef.current.filter((user) => user.id !== id));
  }

  return {
    addUser,
    removeUser,
    ready,
    source,
    updateUser,
    users,
  };
}
