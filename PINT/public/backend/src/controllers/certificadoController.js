const Certificado = require("../model/Certificado");
const Inscricao = require("../model/Inscricao");

const controllers = {};

// Listar todos os certificados
controllers.certificado_list = async (req, res) => {
  try {
    const certificados = await Certificado.findAll({
      include: [Inscricao],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: certificados });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao listar certificados.",details: error.message,});
  }
};

// Detail certificado
controllers.certificado_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const certificado = await Certificado.findByPk(id, {
      include: [Inscricao],
    });

    if (!certificado) {
      return res.status(404).json({ success: false, message: "Certificado não encontrado." });
    }

    res.json({ success: true, data: certificado });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao buscar certificado.", details: error.message,});
  }
};

// Criar certificado
controllers.certificado_create = async (req, res) => {
  try {
    const { inscricaoId, dataCriacao } = req.body;

    if (!inscricaoId) {
      return res.status(400).json({ success: false, message: "ID da inscrição é obrigatório." });
    }

    const inscricao = await Inscricao.findByPk(inscricaoId);
    if (!inscricao) {
      return res.status(400).json({ success: false, message: "Inscrição não encontrada." });
    }

    const novoCertificado = await Certificado.create({
      inscricaoId,
      dataCriacao: dataCriacao || new Date(),
    });

    res.status(201).json({ success: true, data: novoCertificado });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar certificado.", details: error.message,});
  }
};


// Atualizar certificado
controllers.certificado_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { inscricaoId, dataCriacao } = req.body;

    const certificado = await Certificado.findByPk(id);
    if (!certificado) {
      return res.status(404).json({ success: false, message: "Certificado não encontrado." });
    }

    if (inscricaoId) {
      const inscricao = await Inscricao.findByPk(inscricaoId);
      if (!inscricao) {
        return res.status(400).json({ success: false, message: "Inscrição não encontrada." });
      }
    }

    await certificado.update({
      inscricaoId,
      dataCriacao,
    });

    res.json({ success: true, data: certificado });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao atualizar certificado.", details: error.message,});
  }
};

// Apagar certificado
controllers.certificado_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const certificado = await Certificado.findByPk(id);

    if (!certificado) {
      return res.status(404).json({ success: false, message: "Certificado não encontrado." });
    }

    await certificado.destroy();

    res.json({ success: true, message: "Certificado apagado com sucesso." });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao apagar certificado.", details: error.message, });
  }
};

module.exports = controllers;
