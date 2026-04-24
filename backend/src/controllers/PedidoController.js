const { Transaction } = require("sequelize");
const sequelize = require("../config/database");
const { Pedido, Produto, Usuario } = require("../models");

class PedidoController {
  async criar(req, res, next) {
    const transaction = await sequelize.transaction();

    try {
      const { produto_id, quantidade, usuario_id } = req.body;
      const quantidadePedido = Number(quantidade);

      if (!Number.isInteger(quantidadePedido) || quantidadePedido <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          mensagem: "Quantidade deve ser um numero inteiro maior que zero",
        });
      }

      const usuario = await Usuario.findByPk(usuario_id, { transaction });

      if (!usuario) {
        await transaction.rollback();
        return res.status(404).json({ mensagem: "Usuario nao encontrado" });
      }

      const produto = await Produto.findByPk(produto_id, {
        lock: Transaction.LOCK.UPDATE,
        transaction,
      });

      if (!produto) {
        await transaction.rollback();
        return res.status(404).json({ mensagem: "Produto nao encontrado" });
      }

      if (quantidadePedido > produto.estoque) {
        await transaction.rollback();
        return res.status(400).json({
          mensagem: "Quantidade maior que o estoque disponivel",
        });
      }

      const pedido = await Pedido.create(
        {
          produto_id,
          quantidade: quantidadePedido,
          usuario_id,
        },
        { transaction },
      );

      await produto.update(
        { estoque: produto.estoque - quantidadePedido },
        { transaction },
      );

      await transaction.commit();

      const pedidoCompleto = await Pedido.findByPk(pedido.id, {
        include: [
          { model: Usuario, as: "usuario" },
          { model: Produto, as: "produto" },
        ],
      });

      return res.status(201).json(pedidoCompleto);
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }

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
    const transaction = await sequelize.transaction();

    try {
      const pedido = await Pedido.findByPk(req.params.id, {
        lock: Transaction.LOCK.UPDATE,
        transaction,
      });

      if (!pedido) {
        await transaction.rollback();
        return res.status(404).json({ mensagem: "Pedido nao encontrado" });
      }

      const proximoUsuarioId = req.body.usuario_id ?? pedido.usuario_id;
      const proximoProdutoId = req.body.produto_id ?? pedido.produto_id;
      const proximaQuantidade =
        req.body.quantidade !== undefined ? Number(req.body.quantidade) : pedido.quantidade;

      if (!Number.isInteger(proximaQuantidade) || proximaQuantidade <= 0) {
        await transaction.rollback();
        return res.status(400).json({
          mensagem: "Quantidade deve ser um numero inteiro maior que zero",
        });
      }

      const usuario = await Usuario.findByPk(proximoUsuarioId, { transaction });

      if (!usuario) {
        await transaction.rollback();
        return res.status(404).json({ mensagem: "Usuario nao encontrado" });
      }

      if (Number(proximoProdutoId) === Number(pedido.produto_id)) {
        const produto = await Produto.findByPk(pedido.produto_id, {
          lock: Transaction.LOCK.UPDATE,
          transaction,
        });

        if (!produto) {
          await transaction.rollback();
          return res.status(404).json({ mensagem: "Produto nao encontrado" });
        }

        const diferencaQuantidade = proximaQuantidade - pedido.quantidade;

        if (diferencaQuantidade > produto.estoque) {
          await transaction.rollback();
          return res.status(400).json({
            mensagem: "Quantidade maior que o estoque disponivel",
          });
        }

        await produto.update(
          { estoque: produto.estoque - diferencaQuantidade },
          { transaction },
        );
      } else {
        const produtoAtual = await Produto.findByPk(pedido.produto_id, {
          lock: Transaction.LOCK.UPDATE,
          transaction,
        });
        const novoProduto = await Produto.findByPk(proximoProdutoId, {
          lock: Transaction.LOCK.UPDATE,
          transaction,
        });

        if (!produtoAtual || !novoProduto) {
          await transaction.rollback();
          return res.status(404).json({ mensagem: "Produto nao encontrado" });
        }

        if (proximaQuantidade > novoProduto.estoque) {
          await transaction.rollback();
          return res.status(400).json({
            mensagem: "Quantidade maior que o estoque disponivel",
          });
        }

        await produtoAtual.update(
          { estoque: produtoAtual.estoque + pedido.quantidade },
          { transaction },
        );
        await novoProduto.update(
          { estoque: novoProduto.estoque - proximaQuantidade },
          { transaction },
        );
      }

      await pedido.update(
        {
          produto_id: proximoProdutoId,
          quantidade: proximaQuantidade,
          usuario_id: proximoUsuarioId,
        },
        { transaction },
      );

      await transaction.commit();

      const pedidoAtualizado = await Pedido.findByPk(pedido.id, {
        include: [
          { model: Usuario, as: "usuario" },
          { model: Produto, as: "produto" },
        ],
      });

      return res.json(pedidoAtualizado);
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }

      return next(error);
    }
  }

  async remover(req, res, next) {
    const transaction = await sequelize.transaction();

    try {
      const pedido = await Pedido.findByPk(req.params.id, {
        lock: Transaction.LOCK.UPDATE,
        transaction,
      });

      if (!pedido) {
        await transaction.rollback();
        return res.status(404).json({ mensagem: "Pedido nao encontrado" });
      }

      const produto = await Produto.findByPk(pedido.produto_id, {
        lock: Transaction.LOCK.UPDATE,
        transaction,
      });

      if (!produto) {
        await transaction.rollback();
        return res.status(404).json({ mensagem: "Produto nao encontrado" });
      }

      await produto.update(
        { estoque: produto.estoque + pedido.quantidade },
        { transaction },
      );
      await pedido.destroy({ transaction });
      await transaction.commit();

      return res.status(204).send();
    } catch (error) {
      if (!transaction.finished) {
        await transaction.rollback();
      }

      return next(error);
    }
  }
}

module.exports = new PedidoController();
