const Aviso = require("../model/Aviso");
const AulaAssincrona = require("../model/AulaAssincrona");
const AulaSincrona = require("../model/AulaSincrona");
const Formador = require("../model/Formador");

const controllers = {};

// Listar todos os avisos
controllers.aviso_list = async (req, res) => {
  try {
    const avisos = await Aviso.findAll({
      include: [AulaAssincrona, AulaSincrona, Formador],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: avisos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar avisos.", error });
  }
};

// Detalhar aviso
controllers.aviso_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const aviso = await Aviso.findByPk(id, {
      include: [AulaAssincrona, AulaSincrona, Formador],
    });

    if (!aviso) {
      return res.status(404).json({ success: false, message: "Aviso não encontrado." });
    }

    res.json({ success: true, data: aviso });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar aviso.", error });
  }
};

// Criar aviso
controllers.aviso_create = async (req, res) => {
  try {
    const { descricao, aulaAssincronaId, aulaSincronaId, formadorId } = req.body;

    if (!descricao) {
      return res.status(400).json({ error: "Descrição é obrigatória." });
    }

    const novoAviso = await Aviso.create({
      descricao,
      aulaAssincronaId: aulaAssincronaId || null,
      aulaSincronaId: aulaSincronaId || null,
      formadorId: formadorId || null,
    });

    res.status(201).json({ success: true, data: novoAviso });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar aviso.", error: error.message });
  }
};

// Atualizar aviso
controllers.aviso_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { descricao, aulaAssincronaId, aulaSincronaId, formadorId } = req.body;

    const aviso = await Aviso.findByPk(id);
    if (!aviso) {
      return res.status(404).json({ error: "Aviso não encontrado." });
    }

    await aviso.update({
      descricao,
      aulaAssincronaId: aulaAssincronaId || null,
      aulaSincronaId: aulaSincronaId || null,
      formadorId: formadorId || null,
    });

    res.json({ success: true, data: aviso });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar aviso.", error: error.message });
  }
};

// Apagar aviso
controllers.aviso_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const aviso = await Aviso.findByPk(id);

    if (!aviso) {
      return res.status(404).json({ error: "Aviso não encontrado." });
    }

    await aviso.destroy();

    res.json({ success: true, message: "Aviso apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar aviso.", details: error.message });
  }
};

module.exports = controllers;
