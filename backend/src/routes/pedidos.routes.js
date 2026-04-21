const { Router } = require("express");
const PedidoController = require("../controllers/PedidoController");

const pedidosRoutes = Router();

pedidosRoutes.post("/", PedidoController.criar);
pedidosRoutes.get("/", PedidoController.listar);
pedidosRoutes.get("/:id", PedidoController.buscarPorId);
pedidosRoutes.put("/:id", PedidoController.atualizar);
pedidosRoutes.delete("/:id", PedidoController.remover);

module.exports = pedidosRoutes;
