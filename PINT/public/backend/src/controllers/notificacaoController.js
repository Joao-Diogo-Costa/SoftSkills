const Notificacao = require("../model/Notificacao");
const Utilizador = require("../model/Utilizador");
const Curso = require("../model/Curso");

const controllers = {};

// Listar todas as notificações
controllers.notificacao_list = async (req, res) => {
  try {
    const lista = await Notificacao.findAll({
      include: [Utilizador, Curso],
      order: [["dataEnvio", "DESC"]],
    });
    res.json({ success: true, data: lista });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar notificações.", details: error.message,});
  }
};

// Detalhe de uma notificação
controllers.notificacao_detail = async (req, res) => {
  try {
    const notificacao = await Notificacao.findByPk(req.params.id, {
      include: [Utilizador, Curso],
    });
    if (!notificacao) {
      return res.status(404).json({ success: false, message: "Notificação não encontrada." });
    }
    res.json({ success: true, data: notificacao });
  } catch (error) {
    res.status(500).json({ success: false,message: "Erro ao obter notificação.", details: error.message,});
  }
};

// Criar nova notificação
controllers.notificacao_create = async (req, res) => {
  try {
    const { mensagem, tipo, utilizadorId, cursoId } = req.body;

    if (!mensagem || !tipo || !utilizadorId) {
      return res.status(400).json({ success: false, message: "Mensagem, tipo e utilizador são obrigatórios." });
    }

    const utilizador = await Utilizador.findByPk(utilizadorId);
    if (!utilizador) {
      return res.status(400).json({ success: false, message: "Utilizador inválido." });
    }

    if (cursoId) {
      const curso = await Curso.findByPk(cursoId);
      if (!curso) {
        return res.status(400).json({ success: false, message: "Curso inválido." });
      }
    }

    const novaNotificacao = await Notificacao.create({
      mensagem,
      tipo,
      utilizadorId,
      cursoId,
    });

    res.status(201).json({ success: true, data: novaNotificacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar notificação.",details: error.message,});
  }
};

// Atualizar notificação
controllers.notificacao_update = async (req, res) => {
  try {
    const { mensagem, tipo, lida } = req.body;
    const notificacao = await Notificacao.findByPk(req.params.id);

    if (!notificacao) {
      return res.status(404).json({ success: false, message: "Notificação não encontrada." });
    }

    await notificacao.update({
      mensagem: mensagem ?? notificacao.mensagem,
      tipo: tipo ?? notificacao.tipo,
      lida: lida ?? notificacao.lida,
    });

    res.json({ success: true, data: notificacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar notificação.",details: error.message,});
  }
};


// Apagar notificação
controllers.notificacao_delete = async (req, res) => {
  try {
    const notificacao = await Notificacao.findByPk(req.params.id);
    if (!notificacao) {
      return res.status(404).json({ success: false, message: "Notificação não encontrada." });
    }

    await notificacao.destroy();
    res.json({ success: true, message: "Notificação removida com sucesso." });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao remover notificação.", details: error.message, });
  }
};


module.exports = controllers;
