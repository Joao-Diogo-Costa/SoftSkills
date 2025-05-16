const Forum = require("../model/Forum");
const Topico = require("../model/Topico");

const controllers = {};

// Listar Fóruns
controllers.forum_list = async (req, res) => {
  try {
    const forums = await Forum.findAll({
      include: [Topico], 
      order: [["id", "ASC"]], 
    });
    res.json({ success: true, data: forums });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar fóruns.", details: error.message });
  }
};

// Detalhar Fórum
controllers.forum_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const forum = await Forum.findByPk(id, {
      include: [Topico], 
    });

    if (forum) {
      res.json({ success: true, data: forum });
    } else {
      res.status(404).json({ success: false, message: "Fórum não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar fórum.", details: error.message });
  }
};

// Criar Fórum
controllers.forum_create = async (req, res) => {
  try {
    const { conteudo, topicoId } = req.body;

    const topico = await Topico.findByPk(topicoId);
    if (!topico) {
      return res.status(404).json({ message: "Tópico não encontrado." });
    }

    const novoForum = await Forum.create({
      conteudo,
      topicoId,
    });

    res.status(201).json({ success: true, data: novoForum });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar fórum.", details: error.message });
  }
};

// Atualizar Fórum
controllers.forum_update = async (req, res) => {
  try {
    const { conteudo, topicoId } = req.body;
    const id = req.params.id;

    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res.status(404).json({ message: "Fórum não encontrado." });
    }
o
    if (topicoId) {
      const topico = await Topico.findByPk(topicoId);
      if (!topico) {
        return res.status(404).json({ message: "Tópico não encontrado." });
      }
    }

    await forum.update({
      conteudo,
      topicoId,
    });

    res.json({ success: true, data: forum });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar fórum.", details: error.message });
  }
};

// Apagar Fórum
controllers.forum_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const forum = await Forum.findByPk(id);

    if (!forum) {
      return res.status(404).json({ message: "Fórum não encontrado." });
    }

    await forum.destroy();

    res.json({ success: true, message: "Fórum apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar fórum.", details: error.message });
  }
};

module.exports = controllers;
