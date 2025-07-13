const AvaliacaoComentario = require("../model/AvaliacaoComentario");
const Comentario = require("../model/Comentario");
const Utilizador = require("../model/Utilizador");

const controllers = {};

// Listar todas as avaliações (likes) de comentários
controllers.avaliacao_list = async (req, res) => {
  try {
    const avaliacoes = await AvaliacaoComentario.findAll({
      include: [Comentario, Utilizador],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: avaliacoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar avaliações.", details: error.message });
  }
};

// Obter total de likes de um comentário
controllers.total_likes = async (req, res) => {
  try {
    const comentarioId = req.params.comentarioId;
    const total = await AvaliacaoComentario.count({ where: { comentarioId } });
    res.json({ success: true, totalLikes: total });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao contar likes.", details: error.message });
  }
};

// Criar um like (avaliação) para um comentário
controllers.avaliacao_create = async (req, res) => {
  try {
    const { comentarioId, utilizadorId } = req.body;

    if (!comentarioId || !utilizadorId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
    }

    // Verifica se já existe like deste utilizador neste comentário
    const existente = await AvaliacaoComentario.findOne({ where: { comentarioId, utilizadorId } });
    if (existente) {
      return res.status(400).json({ success: false, message: "Já existe like deste utilizador neste comentário." });
    }

    const novaAvaliacao = await AvaliacaoComentario.create({
      comentarioId,
      utilizadorId,
      dataLike: new Date(),
    });

    res.status(201).json({ success: true, data: novaAvaliacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar like.", details: error.message });
  }
};

// Remover avaliação de um comentário
controllers.avaliacao_delete = async (req, res) => {
  try {
    const { comentarioId, utilizadorId } = req.body;

    if (!comentarioId || !utilizadorId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
    }

    const avalicao = await AvaliacaoComentario.findOne({ where: { comentarioId, utilizadorId } });
    if (!avalicao) {
      return res.status(404).json({ success: false, message: "Avalição não encontrada." });
    }

    await like.destroy();
    res.json({ success: true, message: "Avaliação removido com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao remover avaliação.", details: error.message });
  }
};

module.exports = controllers;