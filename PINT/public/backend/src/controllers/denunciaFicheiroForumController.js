const DenunciaFicheiroForum = require("../model/DenunciaFicheiroForum");
const ForumFicheiro = require("../model/ForumFicheiro");
const Utilizador = require("../model/Utilizador");

const controllers = {};

// Listar todas as denúncias de ficheiros do fórum
controllers.denuncia_list = async (req, res) => {
  try {
    const denuncias = await DenunciaFicheiroForum.findAll({
      include: [
        { model: Utilizador },
        { model: ForumFicheiro }
      ],
      order: [["dataDenuncia", "DESC"]],
    });
    res.json({ success: true, data: denuncias });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar denúncias.", details: error.message });
  }
};

// Detalhe de uma denúncia
controllers.denuncia_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const denuncia = await DenunciaFicheiroForum.findByPk(id, {
      include: [ForumFicheiro, Utilizador],
    });
    if (!denuncia) {
      return res.status(404).json({ success: false, message: "Denúncia não encontrada." });
    }
    res.json({ success: true, data: denuncia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar denúncia.", details: error.message });
  }
};

// Criar nova denúncia
controllers.denuncia_create = async (req, res) => {
  try {
    const { descricao, utilizadorId, forumFicheiroId } = req.body;

    if (!descricao || !utilizadorId || !forumFicheiroId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
    }

    const utilizador = await Utilizador.findByPk(utilizadorId);
    if (!utilizador) {
      return res.status(400).json({ success: false, message: "Utilizador inválido." });
    }

    const ficheiro = await ForumFicheiro.findByPk(forumFicheiroId);
    if (!ficheiro) {
      return res.status(400).json({ success: false, message: "Ficheiro do fórum inválido." });
    }

    const novaDenuncia = await DenunciaFicheiroForum.create({
      descricao,
      utilizadorId,
      forumFicheiroId,
    });

    res.status(201).json({ success: true, data: novaDenuncia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar denúncia.", details: error.message });
  }
};

// Atualizar denúncia existente
controllers.denuncia_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { descricao, utilizadorId, forumFicheiroId } = req.body;

    const denuncia = await DenunciaFicheiroForum.findByPk(id);
    if (!denuncia) {
      return res.status(404).json({ success: false, message: "Denúncia não encontrada." });
    }

    if (utilizadorId) {
      const utilizador = await Utilizador.findByPk(utilizadorId);
      if (!utilizador) {
        return res.status(400).json({ success: false, message: "Utilizador inválido." });
      }
    }

    if (forumFicheiroId) {
      const ficheiro = await ForumFicheiro.findByPk(forumFicheiroId);
      if (!ficheiro) {
        return res.status(400).json({ success: false, message: "Ficheiro do fórum inválido." });
      }
    }

    await denuncia.update({
      descricao,
      utilizadorId,
      forumFicheiroId,
    });

    res.json({ success: true, data: denuncia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar denúncia.", details: error.message });
  }
};

// Apagar denúncia
controllers.denuncia_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const denuncia = await DenunciaFicheiroForum.findByPk(id);

    if (!denuncia) {
      return res.status(404).json({ success: false, message: "Denúncia não encontrada." });
    }

    await denuncia.destroy();

    res.json({ success: true, message: "Denúncia removida com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao remover denúncia.", details: error.message });
  }
};

module.exports = controllers;