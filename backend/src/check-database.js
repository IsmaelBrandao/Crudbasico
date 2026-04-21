require("dotenv").config();

const sequelize = require("./config/database");
require("./models");

async function checkDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Conexao com o banco de dados funcionando.");
    process.exit(0);
  } catch (error) {
    console.error("Falha ao conectar no banco de dados.");
    console.error(error.message);
    process.exit(1);
  }
}

checkDatabase();
