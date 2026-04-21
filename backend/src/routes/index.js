const { Router } = require("express");

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({
    nome: "Crudbasico API",
    status: "online",
  });
});

routes.get("/health", (req, res) => {
  return res.json({
    status: "ok",
  });
});

module.exports = routes;
