const Inscricao = require("../model/Inscricao");
const Curso = require("../model/Curso");

const controllers = {};

// Listar todas as inscrições
controllers.inscricao_list = async (req, res) => {
  try {
    const inscricoes = await Inscricao.findAll({
      include: [Formando, Curso],
      order: [["dataInscricao", "DESC"]],
    });

    res.json({ success: true, data: inscricoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar inscrições.", details: error.message });
  }
};

// Detalhar uma inscrição
controllers.inscricao_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const inscricao = await Inscricao.findByPk(id, {
      include: [Formando, Curso],
    });

    if (!inscricao) {
      return res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }

    res.json({ success: true, data: inscricao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar inscrição.", details: error.message });
  }
};

// Criar uma nova inscrição
controllers.inscricao_create = async (req, res) => {
  try {
    const { dataInscricao, formandoId, cursosIds } = req.body;

    if (!dataInscricao || !formandoId || !Array.isArray(cursosIds) || cursosIds.length === 0) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta ou cursosIds inválido." });
    }

    const novaInscricao = await Inscricao.create({ dataInscricao, formandoId });

    await novaInscricao.setCursos(cursosIds); // Cria relação na tabela InscricaoCurso

    res.status(201).json({ success: true, data: novaInscricao });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar inscrição.", details: error.message });
  }
};

// Atualizar inscrição
controllers.inscricao_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { dataInscricao, formandoId, cursosIds } = req.body;

    const inscricao = await Inscricao.findByPk(id);
    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada." });
    }

    await inscricao.update({ dataInscricao, formandoId });

    if (Array.isArray(cursosIds)) {
      await inscricao.setCursos(cursosIds); 
    }

    res.json({ success: true, data: inscricao });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar inscrição.", details: error.message });
  }
};

// Apagar inscrição
controllers.inscricao_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const inscricao = await Inscricao.findByPk(id);
    if (!inscricao) {
      return res.status(404).json({ erro: "Inscrição não encontrada." });
    }

    await inscricao.setCursos([]); 
    await inscricao.destroy();

    res.json({ success: true, message: "Inscrição apagada com sucesso." });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao apagar inscrição.", details: error.message });
  }
};

module.exports = controllers;