const { Router } = require("express");
const ProdutoController = require("../controllers/ProdutoController");

const produtosRoutes = Router();

produtosRoutes.post("/", ProdutoController.criar);
produtosRoutes.get("/", ProdutoController.listar);
produtosRoutes.get("/:id", ProdutoController.buscarPorId);
produtosRoutes.put("/:id", ProdutoController.atualizar);
produtosRoutes.delete("/:id", ProdutoController.remover);

module.exports = produtosRoutes;
