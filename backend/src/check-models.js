const models = require("./models");

const modelNames = Object.values(models).map((model) => model.name);

console.log(`Models carregados: ${modelNames.join(", ")}.`);
