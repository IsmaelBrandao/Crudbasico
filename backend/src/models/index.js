const Usuario = require("./Usuario");
const Produto = require("./Produto");
const Pedido = require("./Pedido");

Usuario.hasMany(Pedido, {
  foreignKey: "usuario_id",
  as: "pedidos",
});

Pedido.belongsTo(Usuario, {
  foreignKey: "usuario_id",
  as: "usuario",
});

Produto.hasMany(Pedido, {
  foreignKey: "produto_id",
  as: "pedidos",
});

Pedido.belongsTo(Produto, {
  foreignKey: "produto_id",
  as: "produto",
});

module.exports = {
  Usuario,
  Produto,
  Pedido,
};
