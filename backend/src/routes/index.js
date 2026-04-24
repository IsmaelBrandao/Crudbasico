const { Router } = require("express");
const pedidosRoutes = require("./pedidos.routes");
const produtosRoutes = require("./produtos.routes");
const usuariosRoutes = require("./usuarios.routes");

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({
    nome: "Next Comercial API",
    status: "online",
  });
});

routes.get("/health", (req, res) => {
  return res.json({
    status: "ok",
  });
});

routes.use("/usuarios", usuariosRoutes);
routes.use("/produtos", produtosRoutes);
routes.use("/pedidos", pedidosRoutes);

module.exports = routes;
