# Nexo Clientes

CRUD simples de clientes feito com Next.js, React e TypeScript. A aplicação salva os dados no `localStorage`, então funciona como site estático e pode ser hospedada no GitHub Pages, Render Static Site ou qualquer servidor de arquivos.

## Rodar localmente

```bash
pnpm install
pnpm dev
```

Acesse `http://localhost:3000`.

## Validar produção

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm preview
```

O build estático fica em `out/`.

## Hospedar no Render

O arquivo `render.yaml` já está pronto para criar um Static Site:

```yaml
buildCommand: pnpm install --frozen-lockfile && pnpm build
staticPublishPath: ./out
```

No Render, conecte o repositório e use o blueprint ou configure esses mesmos campos manualmente.

## Hospedar no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` publica o conteúdo de `out/` automaticamente quando houver push na branch `main`.

No repositório do GitHub, habilite Pages com a fonte `GitHub Actions`. O workflow define `NEXT_PUBLIC_BASE_PATH` com o nome do repositório para os assets funcionarem em URLs como `usuario.github.io/nome-do-repo/`.

## Observação importante

Este CRUD é 100% frontend. Cada navegador tem sua própria base salva localmente. Para vários usuários compartilharem os mesmos dados, o próximo passo é adicionar uma API com banco de dados.
