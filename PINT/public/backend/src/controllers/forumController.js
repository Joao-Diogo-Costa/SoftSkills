const Forum = require("../model/Forum");
const TopicoC = require("../model/TopicoC");
const controllers = {};

// Listar Fóruns
controllers.forum_list = async (req, res) => {
  try {
    const lista = await Forum.findAll({
      include: [TopicoC],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: lista });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar fóruns.", details: error.message, });
  }
};

// Detalhar Fórum
controllers.forum_detail = async (req, res) => {
  try {
    const forum = await Forum.findByPk(req.params.id, {
      include: [TopicoC],
    });
    if (!forum) {
      return res.status(404).json({ success: false, message: "Fórum não encontrado." });
    }
    res.json({ success: true, data: forum });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar fórum.", details: error.message,});
  }
};

// Criar Fórum
controllers.forum_create = async (req, res) => {
  try {
    const { conteudo, topicoId } = req.body;

    if (!conteudo || !topicoId) {
      return res.status(400).json({ success: false, message: "Conteúdo e ID do tópico são obrigatórios." });
    }

    const topico = await TopicoC.findByPk(topicoId);
    if (!topico) {
      return res.status(400).json({ success: false, message: "Tópico inválido." });
    }

    const novoForum = await Forum.create({ conteudo, topicoId });
    res.status(201).json({ success: true, data: novoForum });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar fórum.", details: error.message,});
  }
};

// Atualizar Fórum
controllers.forum_update = async (req, res) => {
  try {
    const { conteudo, topicoId } = req.body;
    const forum = await Forum.findByPk(req.params.id);

    if (!forum) {
      return res.status(404).json({ success: false, message: "Fórum não encontrado." });
    }

    if (topicoId) {
      const topico = await TopicoC.findByPk(topicoId);
      if (!topico) {
        return res.status(400).json({ success: false, message: "Tópico inválido." });
      }
    }

    await forum.update({ conteudo, topicoId });

    res.json({ success: true, data: forum });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar fórum.", details: error.message,});
  }
};

// Apagar Fórum
controllers.forum_delete = async (req, res) => {
  try {
    const forum = await Forum.findByPk(req.params.id);
    if (!forum) {
      return res.status(404).json({ success: false, message: "Fórum não encontrado." });
    }

    await forum.destroy();
    res.json({ success: true, message: "Fórum removido com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao remover fórum.", details: error.message,});
  }
};

module.exports = controllers;
