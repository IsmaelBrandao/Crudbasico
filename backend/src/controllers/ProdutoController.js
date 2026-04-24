const { Produto } = require("../models");

class ProdutoController {
  async criar(req, res, next) {
    try {
      const produto = await Produto.create(buildProdutoPayload(req.body));

      return res.status(201).json(produto);
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const produtos = await Produto.findAll({
        order: [["id", "ASC"]],
      });

      return res.json(produtos);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const produto = await Produto.findByPk(req.params.id);

      if (!produto) {
        return res.status(404).json({ mensagem: "Produto nao encontrado" });
      }

      return res.json(produto);
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const produto = await Produto.findByPk(req.params.id);

      if (!produto) {
        return res.status(404).json({ mensagem: "Produto nao encontrado" });
      }

      await produto.update(buildProdutoPayload(req.body));

      return res.json(produto);
    } catch (error) {
      return next(error);
    }
  }

  async remover(req, res, next) {
    try {
      const produto = await Produto.findByPk(req.params.id);

      if (!produto) {
        return res.status(404).json({ mensagem: "Produto nao encontrado" });
      }

      await produto.destroy();

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

function buildProdutoPayload(body) {
  const payload = {};

  if (body.nome !== undefined) {
    payload.nome = String(body.nome).trim();
  }

  if (body.preco !== undefined) {
    payload.preco = Number(body.preco);
  }

  if (body.estoque !== undefined) {
    payload.estoque = Number(body.estoque);
  }

  return payload;
}

module.exports = new ProdutoController();
