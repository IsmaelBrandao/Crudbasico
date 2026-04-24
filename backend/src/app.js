const cors = require("cors");
const express = require("express");
const routes = require("./routes");

const app = express();
const corsOrigin = parseCorsOrigin(process.env.CORS_ORIGIN);

app.use(
  cors({
    credentials: true,
    origin: corsOrigin,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((req, res) => {
  return res.status(404).json({
    mensagem: "Rota nao encontrada",
  });
});

app.use((error, req, res, next) => {
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({
      mensagem: "Dados invalidos",
      erros: error.errors.map((item) => item.message),
    });
  }

  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({
      mensagem: "Registro ja cadastrado",
      erros: error.errors.map((item) => item.message),
    });
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    return res.status(400).json({
      mensagem: "Registro relacionado nao encontrado",
    });
  }

  const status = error.status || 500;
  const mensagem = error.message || "Erro interno do servidor";

  return res.status(status).json({ mensagem });
});

function parseCorsOrigin(value) {
  if (!value || value.trim() === "*") {
    return true;
  }

  const origins = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return origins.length ? origins : true;
}

module.exports = app;
