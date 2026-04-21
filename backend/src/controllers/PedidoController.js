const { Pedido, Produto, Usuario } = require("../models");

class PedidoController {
  async criar(req, res, next) {
    try {
      const pedido = await Pedido.create(req.body);
      const pedidoCompleto = await Pedido.findByPk(pedido.id, {
        include: [
          { model: Usuario, as: "usuario" },
          { model: Produto, as: "produto" },
        ],
      });

      return res.status(201).json(pedidoCompleto);
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const pedidos = await Pedido.findAll({
        include: [
          { model: Usuario, as: "usuario" },
          { model: Produto, as: "produto" },
        ],
        order: [["id", "ASC"]],
      });

      return res.json(pedidos);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const pedido = await Pedido.findByPk(req.params.id, {
        include: [
          { model: Usuario, as: "usuario" },
          { model: Produto, as: "produto" },
        ],
      });

      if (!pedido) {
        return res.status(404).json({ mensagem: "Pedido nao encontrado" });
      }

      return res.json(pedido);
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);

      if (!pedido) {
        return res.status(404).json({ mensagem: "Pedido nao encontrado" });
      }

      await pedido.update(req.body);

      const pedidoAtualizado = await Pedido.findByPk(pedido.id, {
        include: [
          { model: Usuario, as: "usuario" },
          { model: Produto, as: "produto" },
        ],
      });

      return res.json(pedidoAtualizado);
    } catch (error) {
      return next(error);
    }
  }

  async remover(req, res, next) {
    try {
      const pedido = await Pedido.findByPk(req.params.id);

      if (!pedido) {
        return res.status(404).json({ mensagem: "Pedido nao encontrado" });
      }

      await pedido.destroy();

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new PedidoController();
