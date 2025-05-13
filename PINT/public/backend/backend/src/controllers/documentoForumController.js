const DocumentoForum = require("../model/DocumentoForum");
const Comentario = require("../model/Comentario");

const controllers = {};

// Listar Documentos do Fórum
controllers.documento_list = async (req, res) => {
  try {
    const documentos = await DocumentoForum.findAll({
      include: [Comentario], 
      order: [["id", "ASC"]], 
    });
    res.json({ success: true, data: documentos });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao listar documentos.", error });
  }
};

// Detalhar Documento do Fórum
controllers.documento_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const documento = await DocumentoForum.findByPk(id, {
      include: [Comentario], 
    });

    if (documento) {
      res.json({ success: true, data: documento });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Documento não encontrado." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar documento.", error });
  }
};

// Criar Documento do Fórum
controllers.documento_create = async (req, res) => {
  try {
    const { documento, tipoDoc, comentarioId } = req.body;

    if (!comentarioId) {
      return res.status(400).json({ error: "Comentário ID é obrigatório." });
    }

    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }
    
    const novoDocumento = await DocumentoForum.create({
      documento,
      tipoDoc,
      comentarioId,
    });

    res.status(201).json({ success: true, data: novoDocumento });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao criar documento.", error });
  }
};

// Atualizar Documento do Fórum
controllers.documento_update = async (req, res) => {
  try {
    const { documento, tipoDoc, comentarioId } = req.body;
    const id = req.params.id;


    const doc = await DocumentoForum.findByPk(id);

    if (!doc) {
      return res.status(404).json({ error: "Documento não encontrado." });
    }


    const comentario = await Comentario.findByPk(comentarioId);

    if (!comentario) {
      return res.status(404).json({ error: "Comentário não encontrado." });
    }

    await doc.update({
      documento,
      tipoDoc,
      comentarioId,
    });

    res.json({ success: true, data: doc });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao atualizar documento.", details: error.message });
  }
};

// Apagar Documento do Fórum
controllers.documento_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const doc = await DocumentoForum.findByPk(id);

    if (!doc) {
      return res.status(404).json({ error: "Documento não encontrado." });
    }

    await doc.destroy();

    res.json({ success: true, message: "Documento apagado com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao apagar documento.", details: error.message });
  }
};

module.exports = controllers;
