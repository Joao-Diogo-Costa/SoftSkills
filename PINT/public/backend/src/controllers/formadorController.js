const Formador = require("../model/Formador");
const Gestor = require("../model/Gestor");

const controllers = {};

// Listar Formadores
controllers.formador_list = async (req, res) => {
  try {
    const formadores = await Formador.findAll({
      include: [Gestor], 
      order: [["id", "ASC"]], 
    });
    res.json({ success: true, data: formadores });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar formadores.", error });
  }
};

// Detalhar Formador
controllers.formador_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const formador = await Formador.findByPk(id, {
      include: [Gestor], 
    });

    if (formador) {
      res.json({ success: true, data: formador });
    } else {
      res.status(404).json({ success: false, message: "Formador não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar formador.", error });
  }
};

// Criar Formador
controllers.formador_create = async (req, res) => {
  try {
    const { nome, dataNascimento, telefone, gestorId } = req.body;

    // Verificar se o Gestor existe
    if (gestorId) {
      const gestor = await Gestor.findByPk(gestorId);
      if (!gestor) {
        return res.status(404).json({ error: "Gestor não encontrado." });
      }
    }

    const novoFormador = await Formador.create({
      nome,
      dataNascimento,
      telefone,
      gestorId,
    });

    res.status(201).json({ success: true, data: novoFormador });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar formador.", error });
  }
};

// Atualizar Formador
controllers.formador_update = async (req, res) => {
  try {
    const { nome, dataNascimento, telefone, gestorId } = req.body;
    const id = req.params.id;

    const formador = await Formador.findByPk(id);

    if (!formador) {
      return res.status(404).json({ error: "Formador não encontrado." });
    }

    if (gestorId) {
      const gestor = await Gestor.findByPk(gestorId);
      if (!gestor) {
        return res.status(404).json({ error: "Gestor não encontrado." });
      }
    }

    await formador.update({
      nome,
      dataNascimento,
      telefone,
      gestorId,
    });

    res.json({ success: true, data: formador });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar formador.", details: error.message });
  }
};

// Apagar Formador
controllers.formador_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const formador = await Formador.findByPk(id);

    if (!formador) {
      return res.status(404).json({ error: "Formador não encontrado." });
    }

    await formador.destroy();

    res.json({ success: true, message: "Formador apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar formador.", details: error.message });
  }
};

module.exports = controllers;