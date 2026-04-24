const { Pedido, Produto, Usuario } = require("./models");

try {
  const modelNames = [Usuario, Produto, Pedido].map((model) => model.name);
  const associationChecks = [
    {
      alias: "pedidos",
      expectedTarget: "Pedido",
      model: Produto,
    },
    {
      alias: "pedidos",
      expectedTarget: "Pedido",
      model: Usuario,
    },
    {
      alias: "produto",
      expectedTarget: "Produto",
      model: Pedido,
    },
    {
      alias: "usuario",
      expectedTarget: "Usuario",
      model: Pedido,
    },
  ];

  associationChecks.forEach(({ alias, expectedTarget, model }) => {
    const association = model.associations[alias];

    if (!association) {
      throw new Error(`Associacao ${model.name}.${alias} nao encontrada.`);
    }

    if (association.target.name !== expectedTarget) {
      throw new Error(
        `Associacao ${model.name}.${alias} deveria apontar para ${expectedTarget}.`,
      );
    }
  });

  console.log(`Models carregados: ${modelNames.join(", ")}.`);
  console.log(
    "Associacoes validadas: Usuario.pedidos, Produto.pedidos, Pedido.usuario e Pedido.produto.",
  );
} catch (error) {
  console.error("Falha ao validar models e associacoes.");
  console.error(error.message);
  process.exit(1);
}
