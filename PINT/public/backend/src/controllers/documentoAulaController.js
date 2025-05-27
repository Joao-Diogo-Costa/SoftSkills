const DocumentoAula = require("../model/DocumentoAula");
const AulaAssincrona = require("../model/AulaAssincrona");

const controllers = {};

// Listar documentos 
controllers.documentoAula_list = async (req, res) => {
  try {
    const documentos = await DocumentoAula.findAll({
      include: [AulaAssincrona],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: documentos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar documentos de aula.", details: error.message,});
  }
};

// Detail documentos
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

// Criar novo documento 
controllers.documentoAula_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const documento = await DocumentoAula.findByPk(id, {
      include: [AulaAssincrona],
    });
    if (!documento) {
      return res.status(404).json({ success: false, message: "Documento não encontrado." });
    }
    res.json({ success: true, data: documento });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar documento.", details: error.message, });
  }
};

// Atualizar documento de aula existente
controllers.documentoAula_create = async (req, res) => {
  try {
    const { tipoDoc, docAula, aulaAssincronaId } = req.body;

    if (!tipoDoc || !docAula || !aulaAssincronaId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
    }

    // Verificar se AulaAssincrona existe
    const aula = await AulaAssincrona.findByPk(aulaAssincronaId);
    if (!aula) {
      return res.status(400).json({ success: false, message: "Aula Assíncrona inválida." });
    }

    const novoDocumento = await DocumentoAula.create({
      tipoDoc,
      docAula,
      aulaAssincronaId,
    });

    res.status(201).json({ success: true, data: novoDocumento });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar documento de aula.", details: error.message,});
  }
};

controllers.documentoAula_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { tipoDoc, docAula, aulaAssincronaId } = req.body;

    const documento = await DocumentoAula.findByPk(id);
    if (!documento) {
      return res.status(404).json({ success: false, message: "Documento não encontrado." });
    }

    if (aulaAssincronaId) {
      const aula = await AulaAssincrona.findByPk(aulaAssincronaId);
      if (!aula) {
        return res.status(400).json({ success: false, message: "Aula Assíncrona inválida." });
      }
    }

    await documento.update({
      tipoDoc,
      docAula,
      aulaAssincronaId,
    });

    res.json({ success: true, data: documento });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar documento de aula.",
      details: error.message,
    });
  }
};

// Apagar documento de aula
controllers.documentoAula_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const documento = await DocumentoAula.findByPk(id);

    if (!documento) {
      return res.status(404).json({ success: false, message: "Documento não encontrado." });
    }

    await documento.destroy();

    res.json({ success: true, message: "Documento removido com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao remover documento de aula.",details: error.message,});
  }
};

module.exports = controllers;
