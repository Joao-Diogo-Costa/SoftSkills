const Formador = require("../model/Formador");
const Gestor = require("../model/Gestor");
const Utilizador = require("../model/Utilizador");

const controllers = {};

// Listar Formadores
controllers.formador_list = async (req, res) => {
  try {
    const formadores = await Formador.findAll({
      include: [Utilizador, Gestor],
      order: [['id', 'ASC']],
    });
    res.json({ success: true, data: formadores });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar formadores.", details: error.message });
  }
};

// Detail Formador
controllers.formador_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const formador = await Formador.findByPk(id, {
      include: [Utilizador, Gestor],
    });

    if (!formador) {
      return res.status(404).json({ success: false, message: "Formador não encontrado." });
    }

    res.json({ success: true, data: formador });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter formador.", details: error.message });
  }
};

// Criar Formador
controllers.formador_create = async (req, res) => {
  try {
    const { utilizadorId, gestorId } = req.body;

    if (!utilizadorId) {
      return res.status(400).json({ message: "ID de Utilizador é obrigatório." });
    }

    const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
    if (!utilizadorExiste) {
      return res.status(400).json({ message: "ID de Utilizador inválido." });
    }

    const formadorExistente = await Formador.findOne({ where: { utilizadorId } });
    if (formadorExistente) {
      return res.status(409).json({ message: "Este utilizador já está registado como formador." });
    }

    const novoFormador = await Formador.create({
      utilizadorId,
      gestorId: gestorId || null,
    });

    res.status(201).json({ success: true, data: novoFormador });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar formador.", details: error.message });
  }
};

// Atualizar Formador
controllers.formador_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { utilizadorId, gestorId } = req.body;

    const formador = await Formador.findByPk(id);
    if (!formador) {
      return res.status(404).json({ message: "Formador não encontrado." });
    }

    if (utilizadorId) {
      const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
      if (!utilizadorExiste) {
        return res.status(400).json({ message: "ID de Utilizador inválido." });
      }
      if (utilizadorId !== formador.utilizadorId) {
        const formadorExistenteComNovoUtilizador = await Formador.findOne({ where: { utilizadorId } });
        if (formadorExistenteComNovoUtilizador) {
          return res.status(409).json({ message: "Já existe outro formador com este ID de Utilizador." });
        }
      }
    }

    if (gestorId) {
      const gestorExiste = await Gestor.findByPk(gestorId);
      if (!gestorExiste) {
        return res.status(400).json({ message: "ID de Gestor inválido." });
      }
    }

    await formador.update({
      utilizadorId,
      gestorId,
    });

    res.json({ success: true, data: formador });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar formador.", details: error.message });
  }
};

// Apagar Formador
controllers.formador_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const formador = await Formador.findByPk(id);
    if (!formador) {
      return res.status(404).json({ erro: "Formador não encontrado." });
    }

    await formador.destroy();
    res.json({ success: true, message: "Formador eliminado com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao eliminar formador.", details: error.message });
  }
};

module.exports = controllers;