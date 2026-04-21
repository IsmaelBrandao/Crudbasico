require("dotenv").config();

const app = require("./app");
const sequelize = require("./config/database");
require("./models");

const port = process.env.PORT || 3001;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Banco de dados conectado.");
  } catch (error) {
    console.error("Nao foi possivel conectar ao banco de dados.");
    console.error(error.message);
  }

  app.listen(port, () => {
    console.log(`API rodando na porta ${port}.`);
  });
}

startServer();
