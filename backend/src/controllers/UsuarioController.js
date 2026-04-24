const { Usuario } = require("../models");

class UsuarioController {
  async criar(req, res, next) {
    try {
      const usuario = await Usuario.create(buildUsuarioPayload(req.body, true));

      return res.status(201).json(serializeUsuario(usuario));
    } catch (error) {
      return next(error);
    }
  }

  async listar(req, res, next) {
    try {
      const usuarios = await Usuario.findAll({
        attributes: { exclude: ["senha"] },
        order: [["id", "ASC"]],
      });

      return res.json(usuarios);
    } catch (error) {
      return next(error);
    }
  }

  async buscarPorId(req, res, next) {
    try {
      const usuario = await Usuario.findByPk(req.params.id, {
        attributes: { exclude: ["senha"] },
      });

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

      await usuario.update(buildUsuarioPayload(req.body));

      return res.json(serializeUsuario(usuario));
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

function buildUsuarioPayload(body, requirePassword = false) {
  const payload = {};

  if (body.nome !== undefined) {
    payload.nome = String(body.nome).trim();
  }

  if (body.email !== undefined) {
    payload.email = String(body.email).trim().toLowerCase();
  }

  if (body.senha !== undefined && body.senha !== "") {
    payload.senha = String(body.senha);
  }

  if (requirePassword && !payload.senha) {
    payload.senha = "";
  }

  return payload;
}

function serializeUsuario(usuario) {
  const usuarioJson = usuario.toJSON();

  delete usuarioJson.senha;

  return usuarioJson;
}

module.exports = new UsuarioController();
