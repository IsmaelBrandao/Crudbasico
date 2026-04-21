const express = require("express");
const routes = require("./routes");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((req, res) => {
  return res.status(404).json({
    mensagem: "Rota nao encontrada",
  });
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const mensagem = error.message || "Erro interno do servidor";

  return res.status(status).json({ mensagem });
});

module.exports = app;
