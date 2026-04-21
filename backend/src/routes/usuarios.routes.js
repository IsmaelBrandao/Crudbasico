const { Router } = require("express");
const UsuarioController = require("../controllers/UsuarioController");

const usuariosRoutes = Router();

usuariosRoutes.post("/", UsuarioController.criar);
usuariosRoutes.get("/", UsuarioController.listar);
usuariosRoutes.get("/:id", UsuarioController.buscarPorId);
usuariosRoutes.put("/:id", UsuarioController.atualizar);
usuariosRoutes.delete("/:id", UsuarioController.remover);

module.exports = usuariosRoutes;
