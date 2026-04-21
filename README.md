# Crudbasico

Projeto academico organizado em duas partes:

- `frontend/`: interface em Next.js, React e TypeScript.
- `backend/`: API Node.js com Express, Sequelize e MySQL.

O frontend ja possui as telas principais do sistema. A API sera implementada na pasta `backend/` seguindo a estrutura solicitada no trabalho: `config`, `models`, `controllers`, `routes` e `app.js`.

## Estrutura

```text
backend/
frontend/
  public/
  src/
    app/
    components/
    hooks/
    lib/
```

## Rodar o frontend

```bash
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`.

## Validar o frontend

```bash
pnpm lint
pnpm typecheck
pnpm build
```

O build estatico do frontend fica em `frontend/out/`.

## Deploy do frontend

Render:

```yaml
buildCommand: pnpm install --frozen-lockfile && pnpm build
staticPublishPath: ./frontend/out
```

GitHub Pages:

O workflow `.github/workflows/deploy-pages.yml` publica o conteudo de `frontend/out/` quando houver push na branch `main`.
