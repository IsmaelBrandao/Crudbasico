export type UserCard = {
  email: string;
  id: string;
  name: string;
  role: string;
  status: string;
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

export function mapApiUser(user: ApiUser): UserCard {
  return {
    email: user.email,
    id: String(user.id),
    name: user.nome,
    role: "Usuario",
    status: "Ativo",
  };
}
