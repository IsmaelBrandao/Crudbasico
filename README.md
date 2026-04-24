# Next Comercial

O Next Comercial e um sistema academico de gestao comercial pensado para unir um painel web e uma API organizada do jeito que normalmente se espera em um projeto real.

Na pratica, ele esta dividido em duas partes:

- `frontend/`: interface em Next.js, React e TypeScript
- `backend/`: API em Node.js, Express, Sequelize e MySQL

Hoje a base ja cobre os tres CRUDs principais do trabalho: usuarios, produtos e pedidos. Os pedidos respeitam relacionamento com usuario e produto, validam estoque e mantem o estoque consistente ao criar, editar e remover registros.

## Estrutura do projeto

```text
backend/
frontend/
```

No `frontend/` fica o painel.

No `backend/` ficam configuracao, models, controllers, rotas e migrations.

## Como rodar o frontend

```bash
pnpm install
pnpm dev
```

Depois e so abrir `http://localhost:3000`.

Se quiser que o frontend leia os dados da API, copie `frontend/.env.example` para
`frontend/.env.local` e ajuste a URL:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Se essa variavel nao estiver configurada, o painel continua funcionando com dados locais.

## Como rodar o backend

Primeiro, crie o banco no MySQL:

```sql
CREATE DATABASE desafio_sequelize;
```

Depois copie `backend/.env.example` para `backend/.env` e ajuste host, usuario, senha, nome do banco e a origem liberada no CORS.

Com isso pronto, rode as migrations:

```bash
pnpm db:migrate
```

E entao suba a API:

```bash
pnpm dev:backend
```

Por padrao, ela vai responder em `http://localhost:3001`.

## O que a API entrega

As entidades principais sao:

- `usuarios`
- `produtos`
- `pedidos`

As rotas seguem o padrao completo de CRUD:

- `POST`, `GET`, `GET /:id`, `PUT` e `DELETE` para `usuarios`
- `POST`, `GET`, `GET /:id`, `PUT` e `DELETE` para `produtos`
- `POST`, `GET`, `GET /:id`, `PUT` e `DELETE` para `pedidos`

No cadastro de pedido, a regra de negocio ja esta aplicada:

- o usuario precisa existir
- o produto precisa existir
- a quantidade nao pode passar do estoque
- o estoque do produto e reduzido ao criar o pedido
- o estoque volta ao valor correto quando um pedido e alterado ou removido

## Testando a API

Deixei uma colecao pronta do Postman em:

`backend/docs/postman/NextComercial.postman_collection.json`

Para usar:

1. Abra o Postman.
2. Clique em `Import`.
3. Selecione a colecao.
4. Confira se a variavel `baseUrl` esta com `http://localhost:3001`.

Uma ordem simples para testar tudo:

1. Criar um usuario.
2. Criar um produto.
3. Criar um pedido.
4. Listar os pedidos para conferir os relacionamentos.
5. Listar os produtos para ver a baixa no estoque.
6. Tentar um pedido com quantidade maior que o estoque para validar a regra.

No frontend, as telas de usuarios, produtos e pedidos ja conseguem ler, criar, editar e remover itens usando a API quando `NEXT_PUBLIC_API_URL` estiver configurada.

## Deploy

Se quiser publicar tudo no Render, a ideia e separar em dois servicos:

- um `Web Service` para a API em Node.js
- um `Static Site` para o frontend exportado em `frontend/out`

O arquivo `render.yaml` ja deixa essa base pronta para os dois lados.

Para o backend funcionar no Render, alem das variaveis do banco, configure:

```bash
CORS_ORIGIN=https://seu-frontend.onrender.com
```

Para o frontend falar com a API publicada, configure:

```bash
NEXT_PUBLIC_API_URL=https://sua-api.onrender.com
```

Se for publicar o frontend no GitHub Pages, a ideia e a mesma: manter a API no Render e apontar `NEXT_PUBLIC_API_URL` para a URL dela.

## Comandos uteis

```bash
pnpm check:backend
pnpm check:models
pnpm db:migrate
pnpm db:migrate:undo
pnpm lint
pnpm typecheck
pnpm build
```

## Deploy do frontend

O build estatico do frontend sai em `frontend/out`.

No Render, a configuracao usada hoje e:

```yaml
buildCommand: pnpm install --frozen-lockfile && pnpm build
staticPublishPath: ./frontend/out
```

Se for publicar no GitHub Pages, o workflow em `.github/workflows/deploy-pages.yml` ja usa esse mesmo output.
