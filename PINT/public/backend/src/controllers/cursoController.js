const Curso = require("../model/Curso");
const CategoriaC = require("../model/CategoriaC");
const AreaC = require("../model/AreaC");
const TopicoC = require("../model/TopicoC");
const sequelize = require("../model/database");


const controllers = {};

// Listar cursos
controllers.curso_list = async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: TopicoC,
      order: [["dataUpload", "DESC"]],
    });
    res.json({ success: true, data: cursos });
  } catch (error) {
    res.status(500).json({ success: false,message: "Erro ao listar cursos.", details: error.message, });
  }
};

// Detail curso
controllers.curso_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const curso = await Curso.findByPk(id, { include: TopicoC });
    if (!curso) {
      return res.status(404).json({ success: false, message: "Curso não encontrado." });
    }
    res.json({ success: true, data: curso });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao buscar curso.",details: error.message, });
  }
};

// Criar curso
controllers.curso_create = async (req, res) => {
  try {
    const {nome, dataUpload,tipoCurso, vaga, dataLimiteInscricao, estado, descricaoCurso, duracao, nivel, pontuacao, imagemBanner, topicoId, } = req.body;

    if (!nome || !dataUpload || !descricaoCurso || !duracao || !topicoId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
    }

    // Verificar se tópico existe
    const topico = await TopicoC.findByPk(topicoId);
    if (!topico) {
      return res.status(400).json({ success: false, message: "Tópico inválido." });
    }

    const novoCurso = await Curso.create({
      nome,
      dataUpload,
      tipoCurso,
      vaga,
      dataLimiteInscricao,
      estado,
      descricaoCurso,
      duracao,
      nivel,
      pontuacao,
      imagemBanner,
      topicoId,
    });

    res.status(201).json({ success: true, data: novoCurso });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar curso.", details: error.message,});
  }
};

// Atualizar curso
controllers.curso_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome, dataUpload, tipoCurso, vaga, dataLimiteInscricao, estado, descricaoCurso, duracao, nivel, pontuacao, imagemBanner, topicoId,} = req.body;

    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res.status(404).json({ success: false, message: "Curso não encontrado." });
    }

    if (topicoId) {
      const topico = await TopicoC.findByPk(topicoId);
      if (!topico) {
        return res.status(400).json({ success: false, message: "Tópico inválido." });
      }
    }

    await curso.update({
      nome,
      dataUpload,
      tipoCurso,
      vaga, 
      dataLimiteInscricao,
      estado,
      descricaoCurso,
      duracao,
      nivel,
      pontuacao,
      imagemBanner,
      topicoId,
    });

    res.json({ success: true, data: curso });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar curso.",
      details: error.message,
    });
  }
};

// Apagar curso
controllers.curso_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ success: false, message: "Curso não encontrado." });
    }

    await curso.destroy();

    res.json({ success: true, message: "Curso apagado com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao apagar curso.", details: error.message,
    });
  }
};

module.exports = controllers;