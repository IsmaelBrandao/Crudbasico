require("dotenv").config();

const databaseConfig = {
  username: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "desafio_sequelize",
  host: process.env.DB_HOST || "localhost",
  dialect: process.env.DB_DIALECT || "mysql",
};

module.exports = {
  development: databaseConfig,
  test: databaseConfig,
  production: {
    ...databaseConfig,
    logging: false,
  },
};
