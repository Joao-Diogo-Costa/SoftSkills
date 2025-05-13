const Comentario = require("../model/Comentario");
const Forum = require("../model/Forum");
const Formando = require("../model/Formando");

const controllers = {};

// Listar todos os comentários
controllers.comentario_list = async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      include: [Forum, Formando],
      order: [["dataComentario", "DESC"]],
    });
    res.json({ success: true, data: comentarios });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar comentários.", error });
  }
};

// Detalhar um comentário
controllers.comentario_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const comentario = await Comentario.findByPk(id, {
      include: [Forum, Formando],
    });

    if (!comentario) {
      return res.status(404).json({ success: false, message: "Comentário não encontrado." });
    }

    res.json({ success: true, data: comentario });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar comentário.", error });
  }
};

// Criar comentário
controllers.comentario_create = async (req, res) => {
  try {
    const { texto, forumId, formandoId } = req.body;

    if (!texto || !forumId || !formandoId) {
      return res.status(400).json({ error: "Campos obrigatórios em falta." });
    }

    const novoComentario = await Comentario.create({
      texto,
      forumId,
      formandoId,
    });

    res.status(201).json({ success: true, data: novoComentario });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar comentário.", error: error.message });
  }
};

// Atualizar comentário
controllers.comentario_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { texto } = req.body;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    await comentario.update({ texto });
    res.json({ success: true, data: comentario });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar comentário.", error: error.message });
  }
};

// Apagar comentário
controllers.comentario_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    await comentario.destroy();
    res.json({ success: true, message: "Comentário apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar comentário.", details: error.message });
  }
};

module.exports = controllers;