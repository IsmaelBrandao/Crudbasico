# Nexo Clientes

CRUD de clientes feito com Next.js, React e TypeScript.

## Banco de dados

Este projeto ainda nao usa banco de dados. Os clientes ficam salvos no `localStorage`, ou seja, cada navegador tem sua propria carteira local.

Isso ja permite testar o fluxo completo de CRUD: criar, listar, editar e remover clientes. Para varios usuarios compartilharem os mesmos dados, o proximo passo e adicionar uma API com banco de dados, por exemplo PostgreSQL, Supabase, Neon ou Prisma.

## Telas

- `/login`: entrada do usuario.
- `/dashboard`: resumo da carteira.
- `/clientes`: busca, filtros, edicao, remocao e cadastro.
- `/clientes/novo`: abre o cadastro de cliente.
- `/clientes/editar?id=ID_DO_CLIENTE`: abre a edicao de cliente.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`.

## Validar producao

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

O build estatico fica em `out/`.

## Hospedar no Render

O arquivo `render.yaml` ja esta pronto para criar um Static Site:

```yaml
buildCommand: pnpm install --frozen-lockfile && pnpm build
staticPublishPath: ./out
```

No Render, conecte o repositorio e use o blueprint ou configure esses mesmos campos manualmente.

## Hospedar no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` publica o conteudo de `out/` automaticamente quando houver push na branch `main`.

No repositorio do GitHub, habilite Pages com a fonte `GitHub Actions`. O workflow define `NEXT_PUBLIC_BASE_PATH` com o nome do repositorio para os assets funcionarem em URLs como `usuario.github.io/nome-do-repo/`.
