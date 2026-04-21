const { Usuario } = require("../models");

class UsuarioController {
  async criar(req, res, next) {
    try {
      const usuario = await Usuario.create(req.body);

      return res.status(201).json(usuario);
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const usuarios = await Usuario.findAll({
        order: [["id", "ASC"]],
      });

      return res.json(usuarios);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ mensagem: "Usuario nao encontrado" });
      }

      return res.json(usuario);
    } catch (error) {
      return next(error);
    }
  }

  async atualizar(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ mensagem: "Usuario nao encontrado" });
      }

      await usuario.update(req.body);

      return res.json(usuario);
    } catch (error) {
      return next(error);
    }
  }

  async remover(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.params.id);

      if (!usuario) {
        return res.status(404).json({ mensagem: "Usuario nao encontrado" });
      }

      await usuario.destroy();

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = new UsuarioController();
