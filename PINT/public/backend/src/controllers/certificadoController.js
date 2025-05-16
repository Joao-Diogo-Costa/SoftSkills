const Certificado = require("../model/Certificado");
const Formando = require("../model/Formando");

const controllers = {};

// Listar todos os certificados
controllers.certificado_list = async (req, res) => {
  try {
    const certificados = await Certificado.findAll({
      include: [Formando],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: certificados });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar certificados.", details: error.message });
  }
};

// Detalhar um certificado por ID
controllers.certificado_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const certificado = await Certificado.findByPk(id, {
      include: [Formando],
    });

    if (!certificado) {
      return res.status(404).json({ success: false, message: "Certificado não encontrado." });
    }

    res.json({ success: true, data: certificado });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar certificado.", details: error.message });
  }
};

// Criar certificado
controllers.certificado_create = async (req, res) => {
  try {
    const { dataCriacao, formandoId } = req.body;

    if (!formandoId) {
      return res.status(400).json({ message: "ID do formando é obrigatório." });
    }

    const certificado = await Certificado.create({
      dataCriacao: dataCriacao || new Date(),
      formandoId,
    });

    res.status(201).json({ success: true, data: certificado });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar certificado.", details: error.message });
  }
};

// Atualizar certificado
controllers.certificado_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { dataCriacao, formandoId } = req.body;

    const certificado = await Certificado.findByPk(id);
    if (!certificado) {
      return res.status(404).json({ message: "Certificado não encontrado." });
    }

    await certificado.update({
      dataCriacao: dataCriacao || certificado.dataCriacao,
      formandoId: formandoId || certificado.formandoId,
    });

    res.json({ success: true, data: certificado });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar certificado.", details: error.message });
  }
};

// Apagar certificado
controllers.certificado_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const certificado = await Certificado.findByPk(id);

    if (!certificado) {
      return res.status(404).json({ message: "Certificado não encontrado." });
    }

    await certificado.destroy();
    res.json({ success: true, message: "Certificado apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar certificado.", details: error.message });
  }
};

module.exports = controllers;
