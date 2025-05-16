const DocumentoAula = require("../model/DocumentoAula");
const AulaAssincrona = require("../model/AulaAssincrona");

const controllers = {};

// Listar todos os documentos de aula
controllers.documentoAula_list = async (req, res) => {
  try {
    const documentosAula = await DocumentoAula.findAll({
      include: [AulaAssincrona],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: documentosAula });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar documentos de aula.", details: error.message });
  }
};

// Detalhar documento de aula por ID
controllers.documentoAula_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const documentoAula = await DocumentoAula.findByPk(id, {
      include: [AulaAssincrona],
    });

    if (!documentoAula) {
      return res.status(404).json({ success: false, message: "Documento de aula não encontrado." });
    }

    res.json({ success: true, data: documentoAula });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar documento de aula.", details: error.message });
  }
};

// Criar novo documento de aula
controllers.documentoAula_create = async (req, res) => {
  try {
    const { tipoDoc, docA, aulaAssincronaId } = req.body;

    if (!tipoDoc || !docA || !aulaAssincronaId) {
      return res.status(400).json({ message: "Campos obrigatórios em falta." });
    }

    const aulaAssincrona = await AulaAssincrona.findByPk(aulaAssincronaId);
    if (!aulaAssincrona) {
      return res.status(404).json({ message: "Aula Assíncrona não encontrada." });
    }

    const novoDocumentoAula = await DocumentoAula.create({
      tipoDoc,
      docA,
      aulaAssincronaId,
    });

    res.status(201).json({ success: true, data: novoDocumentoAula });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar documento de aula.", details: error.message });
  }
};

// Atualizar documento de aula existente
controllers.documentoAula_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { tipoDoc, docA, aulaAssincronaId } = req.body;

    const documentoAula = await DocumentoAula.findByPk(id);
    if (!documentoAula) {
      return res.status(404).json({ message: "Documento de aula não encontrado." });
    }

    if (aulaAssincronaId) {
      const aulaAssincrona = await AulaAssincrona.findByPk(aulaAssincronaId);
      if (!aulaAssincrona) {
        return res.status(404).json({ message: "Aula Assíncrona não encontrada." });
      }
    }

    await documentoAula.update({
      tipoDoc,
      docA,
      aulaAssincronaId,
    });

    res.json({ success: true, data: documentoAula });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar documento de aula.", details: error.message });
  }
};

// Apagar documento de aula
controllers.documentoAula_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const documentoAula = await DocumentoAula.findByPk(id);
    if (!documentoAula) {
      return res.status(404).json({ message: "Documento de aula não encontrado." });
    }

    await documentoAula.destroy();
    res.json({ success: true, message: "Documento de aula removido com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao apagar documento de aula.", details: error.message });
  }
};

module.exports = controllers;
