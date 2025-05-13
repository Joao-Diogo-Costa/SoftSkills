const Denuncia = require("../model/Denuncia");
const Comentario = require("../model/Comentario");

const controllers = {};

// Listar todas as denúncias
controllers.denuncia_list = async (req, res) => {
  try {
    const denuncias = await Denuncia.findAll({
      include: [Comentario],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: denuncias });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar denúncias.", error });
  }
};

// Detalhar denúncia por ID
controllers.denuncia_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const denuncia = await Denuncia.findByPk(id, {
      include: [Comentario],
    });

    if (!denuncia) {
      return res.status(404).json({ success: false, message: "Denúncia não encontrada." });
    }

    res.json({ success: true, data: denuncia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar denúncia.", error });
  }
};

// Criar nova denúncia
controllers.denuncia_create = async (req, res) => {
  try {
    const { descricao, comentarioId } = req.body;

    if (!descricao || !comentarioId) {
      return res.status(400).json({ error: "Campos obrigatórios em falta." });
    }

    const comentario = await Comentario.findByPk(comentarioId);
    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    const novaDenuncia = await Denuncia.create({
      descricao,
      comentarioId,
    });

    res.status(201).json({ success: true, data: novaDenuncia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar denúncia.", error: error.message });
  }
};

// Atualizar denúncia existente
controllers.denuncia_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { descricao, comentarioId } = req.body;

    const denuncia = await Denuncia.findByPk(id);
    if (!denuncia) {
      return res.status(404).json({ error: "Denúncia não encontrada." });
    }

    if (comentarioId) {
      const comentario = await Comentario.findByPk(comentarioId);
      if (!comentario) {
        return res.status(404).json({ error: "Comentário não encontrado." });
      }
    }

    await denuncia.update({ descricao, comentarioId });
    res.json({ success: true, data: denuncia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar denúncia.", error: error.message });
  }
};

// Apagar denúncia
controllers.denuncia_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const denuncia = await Denuncia.findByPk(id);
    if (!denuncia) {
      return res.status(404).json({ error: "Denúncia não encontrada." });
    }

    await denuncia.destroy();
    res.json({ success: true, message: "Denúncia removida com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao apagar denúncia.", error: error.message });
  }
};

module.exports = controllers;
