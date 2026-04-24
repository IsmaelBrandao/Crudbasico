export type UserCard = {
  email: string;
  id: string;
  name: string;
  role: string;
  status: string;
};

export type UserForm = {
  email: string;
  name: string;
  password: string;
};

export type ApiUser = {
  email: string;
  id: number;
  nome: string;
};

export const seedUsers: UserCard[] = [
  {
    email: "comercial@nextcomercial.local",
    id: "usr-comercial",
    name: "Equipe Comercial",
    role: "Vendas",
    status: "Ativo",
  },
  {
    email: "atendimento@nextcomercial.local",
    id: "usr-atendimento",
    name: "Atendimento",
    role: "Operacao",
    status: "Ativo",
  },
];

export const emptyUserForm: UserForm = {
  email: "",
  name: "",
  password: "",
};

export function mapApiUser(user: ApiUser): UserCard {
  return {
    email: user.email,
    id: String(user.id),
    name: user.nome,
    role: "Usuario",
    status: "Ativo",
  };
}

export function createUserId() {
  return globalThis.crypto?.randomUUID?.() ?? `usr-${Date.now()}`;
}

export function mapUserToApiInput(user: UserForm) {
  return {
    email: user.email.trim(),
    nome: user.name.trim(),
    ...(user.password ? { senha: user.password } : {}),
  };
}

export function createLocalUser(form: UserForm): UserCard {
  return {
    email: form.email.trim(),
    id: createUserId(),
    name: form.name.trim(),
    role: "Usuario",
    status: "Ativo",
  };
}

export function updateLocalUser(user: UserCard, form: UserForm): UserCard {
  return {
    ...user,
    email: form.email.trim(),
    name: form.name.trim(),
  };
}
