const Notificacao = require("../model/Notificacao");
const Gestor = require("../model/Gestor");
const Formador = require("../model/Formador");
const Formando = require("../model/Formando");

const controllers = {};

// Listar todas as notificações
controllers.notificacao_list = async (req, res) => {
  try {
    const notificacoes = await Notificacao.findAll({
      include: [Gestor, Formador, Formando],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: notificacoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar notificações.", error });
  }
};

// Detalhe de uma notificação
controllers.notificacao_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const notificacao = await Notificacao.findByPk(id, {
      include: [Gestor, Formador, Formando],
    });

    if (notificacao) {
      res.json({ success: true, data: notificacao });
    } else {
      res.status(404).json({ success: false, message: "Notificação não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar notificação.", error });
  }
};

// Criar nova notificação
controllers.notificacao_create = async (req, res) => {
  try {
    const { mensagem, dataEnvio, gestorId, formadorId, formandoId } = req.body;

    if (!mensagem || !dataEnvio) {
      return res.status(400).json({ erro: "Mensagem e dataEnvio são obrigatórios." });
    }

    const novaNotificacao = await Notificacao.create({
      mensagem,
      dataEnvio,
      gestorId,
      formadorId,
      formandoId,
    });

    res.status(201).json({ success: true, data: novaNotificacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar notificação.", error: error.message });
  }
};

// Atualizar notificação
controllers.notificacao_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { mensagem, dataEnvio, gestorId, formadorId, formandoId } = req.body;

    const notificacao = await Notificacao.findByPk(id);
    if (!notificacao) {
      return res.status(404).json({ erro: "Notificação não encontrada." });
    }

    await notificacao.update({
      mensagem,
      dataEnvio,
      gestorId,
      formadorId,
      formandoId,
    });

    res.json({ success: true, data: notificacao });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar notificação.", details: error.message });
  }
};

// Apagar notificação
controllers.notificacao_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const notificacao = await Notificacao.findByPk(id);
    if (!notificacao) {
      return res.status(404).json({ error: "Notificação não encontrada." });
    }

    await notificacao.destroy();

    res.json({ success: true, message: "Notificação removida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover notificação.", details: error.message });
  }
};

module.exports = controllers;
