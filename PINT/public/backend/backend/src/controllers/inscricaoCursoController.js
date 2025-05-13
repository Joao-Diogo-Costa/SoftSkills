const InscricaoCurso = require("../model/InscricaoCurso");

const controllers = {};

// Listar todas as inscrições
controllers.inscricao_list = async (req, res) => {
  try {
    const inscricoes = await InscricaoCurso.findAll({
      order: [["inscricaoId", "ASC"]],
    });

    res.json({ success: true, data: inscricoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar inscrições.", error });
  }
};

// Detalhe da inscrição específica
controllers.inscricao_detail = async (req, res) => {
  try {
    const { inscricaoId, cursoId } = req.params;

    const inscricao = await InscricaoCurso.findOne({
      where: { inscricaoId, cursoId },
    });

    if (inscricao) {
      res.json({ success: true, data: inscricao });
    } else {
      res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar inscrição.", error });
  }
};

// Criar nova inscrição
controllers.inscricao_create = async (req, res) => {
  try {
    const { inscricaoId, cursoId } = req.body;

    if (!inscricaoId || !cursoId) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const novaInscricao = await InscricaoCurso.create({ inscricaoId, cursoId });

    res.status(201).json({ success: true, data: novaInscricao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar inscrição.", error: error.message });
  }
};

// Apagar inscrição
controllers.inscricao_delete = async (req, res) => {
  try {
    const { inscricaoId, cursoId } = req.params;

    const inscricao = await InscricaoCurso.findOne({
      where: { inscricaoId, cursoId },
    });

    if (!inscricao) {
      return res.status(404).json({ error: "Inscrição não encontrada." });
    }

    await inscricao.destroy();

    res.json({ success: true, message: "Inscrição removida com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover inscrição.", details: error.message });
  }
};

module.exports = controllers;
