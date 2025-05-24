const Comentario = require("../model/Comentario");
const Forum = require("../model/Forum");
const Utilizador = require("../model/Utilizador");

const controllers = {};

// Listar todos os comentários
controllers.comentario_list = async (req, res) => {
  try {
    const comentarios = await Comentario.findAll({
      include: [Forum, Utilizador],
      order: [["dataComentario", "DESC"]],
    });

    res.json({ success: true, data: comentarios });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao listar comentários.", details: error.message,});
  }
};

// Detalhar um comentário
controllers.comentario_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const comentario = await Comentario.findByPk(id, {
      include: [Forum, Utilizador],
    });

    if (!comentario) {
      return res.status(404).json({ success: false, message: "Comentário não encontrado." });
    }

    res.json({ success: true, data: comentario });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar comentário.", details: error.message, });
  }
};

// Criar comentário
controllers.comentario_create = async (req, res) => {
  try {
    const { texto, ficheiroNome, ficheiroCaminho, forumId, utilizadorId } = req.body;

    if (!texto || !forumId || !utilizadorId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
    }

    // Verificar existência de forum e utilizador
    const forum = await Forum.findByPk(forumId);
    if (!forum) {
      return res.status(400).json({ success: false, message: "Fórum inválido." });
    }

    const utilizador = await Utilizador.findByPk(utilizadorId);
    if (!utilizador) {
      return res.status(400).json({ success: false, message: "Utilizador inválido." });
    }

    const novoComentario = await Comentario.create({
      texto,
      ficheiroNome: ficheiroNome || null,
      ficheiroCaminho: ficheiroCaminho || null,
      forumId,
      utilizadorId,
      dataComentario: new Date(),
    });

    res.status(201).json({ success: true, data: novoComentario });
  } catch (error) {
    res.status(500).json({ success: false,  message: "Erro ao criar comentário.", details: error.message,});
  }
};

// Atualizar comentário
controllers.comentario_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { texto, ficheiroNome, ficheiroCaminho, forumId, utilizadorId } = req.body;

    const comentario = await Comentario.findByPk(id);
    if (!comentario) {
      return res.status(404).json({ success: false, message: "Comentário não encontrado." });
    }

    // Se for atualizar forumId ou utilizadorId, validar
    if (forumId) {
      const forum = await Forum.findByPk(forumId);
      if (!forum) {
        return res.status(400).json({ success: false, message: "Fórum inválido." });
      }
    }

    if (utilizadorId) {
      const utilizador = await Utilizador.findByPk(utilizadorId);
      if (!utilizador) {
        return res.status(400).json({ success: false, message: "Utilizador inválido." });
      }
    }

    await comentario.update({
      texto,
      ficheiroNome,
      ficheiroCaminho,
      forumId,
      utilizadorId,
    });

    res.json({ success: true, data: comentario });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar comentário.", details: error.message, });
  }
};

// Apagar comentário
controllers.comentario_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const comentario = await Comentario.findByPk(id);

    if (!comentario) {
      return res.status(404).json({ success: false, message: "Comentário não encontrado." });
    }

    await comentario.destroy();

    res.json({ success: true, message: "Comentário apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao apagar comentário.", details: error.message,});
  }
};

module.exports = controllers;