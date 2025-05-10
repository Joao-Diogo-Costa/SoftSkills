const Curso = require("../model/Curso");
const Formador = require("../model/Formador");
const CategoriaC = require("../model/CategoriaC");
const AreaC = require("../model/AreaC");
const TopicoC = require("../model/TopicoC");
const sequelize = require("../model/database");


const controllers = {};

// Listar cursos
controllers.curso_list = async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: [Formador, CategoriaC, AreaC, TopicoC],
      attributes: ['id', 'nome', 'descricaoCurso', 'duracao', 'pontuacao', 'formadorId', 'categoriaId', 'areaId', 'topicoId'],
      order: [['categoriaId', 'ASC']],
    });

    res.json({ success: true, data: cursos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar cursos.", error });
  }
};

// Detail curso
controllers.curso_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const curso = await Curso.findByPk(id, {
      include: [Formador, CategoriaC, AreaC, TopicoC],
    });

    if (curso) {
      res.json({ success: true, data: curso });
    } else {
      res.status(404).json({ success: false, message: "Curso não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao encontrar curso.", error });
  }
};

// Criar curso
controllers.curso_create = async (req, res) => {
  console.log("Corpo da requisição (req.body):", req.body);

  try {
    const { nome, descricaoCurso, duracao, pontuacao, formadorNome, categoriaNome, areaNome, topicoNome } = req.body;

    if (!nome || !descricaoCurso || !duracao || !pontuacao || !formadorNome || !categoriaNome || !areaNome || !topicoNome) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    // Buscar formador pelo nome
    const formadorObj = await Formador.findOne({ where: { nome: formadorNome } });

    if (!formadorObj) {
      return res.status(404).json({ erro: "Formador não encontrado com esse nome." });
    }

    // Buscar categoria pela nome
    const categoriaObj = await CategoriaC.findOne({ where: { nome: categoriaNome } });
    if (!categoriaObj) {
      return res.status(404).json({ erro: "Categoria não encontrada com esse nome." });
    }

    // Buscar Area pelo nome
    const areaObj = await AreaC.findOne({ where: { nome: areaNome } });
    if (!areaObj) {
      return res.status(404).json({ erro: "Area não encontrada com esse nome." });
    }
    
    // Buscar Topico pelo nome
    const topicoObj = await TopicoC.findOne({ where: { nome: topicoNome } });
    if (!topicoObj) {
      return res.status(404).json({ erro: "Topico não encontrado com esse nome." });
    }

    const novoCurso = await Curso.create({
      nome,
      descricaoCurso,
      duracao,
      pontuacao,
      formadorId: formadorObj.id,
      categoriaId: categoriaObj.id,
      areaId: areaObj.id,
      topicoId: topicoObj.id,
    });

    res.status(201).json(novoCurso);
  } catch (err) {
    console.error("Erro ao criar curso:", err); // Exibe detalhes no console
    res.status(500).json({ erro: "Erro ao criar curso.", details: err.message });
  }
};

// Atualizar curso
controllers.curso_update = async (req, res) => {
  try {
    const { nome, descricaoCurso, duracao, pontuacao, formadorNome, categoriaNome, areaNome, topicoNome } = req.body;
    const curso = await Curso.findByPk(req.params.id);

    // Buscar formador pelo nome
    const formadorObj = await Formador.findOne({ where: { nome: formadorNome } });
    if (!formadorObj) {
      return res.status(404).json({ erro: "Formador não encontrado com esse nome." });
    }

    // Buscar categoria pela nome
    const categoriaObj = await CategoriaC.findOne({ where: { nome: categoriaNome } });
    if (!categoriaObj) {
      return res.status(404).json({ erro: "Categoria não encontrada com esse nome." });
    }

    // Buscar Area pelo nome
    const areaObj = await AreaC.findOne({ where: { nome: areaNome } });
    if (!areaObj) {
      return res.status(404).json({ erro: "Area não encontrada com esse nome." });
    }
    
    // Buscar Topico pelo nome
    const topicoObj = await TopicoC.findOne({ where: { nome: topicoNome } });
    if (!topicoObj) {
      return res.status(404).json({ erro: "Topico não encontrado com esse nome." });
    }


    if (curso) {
      await curso.update({
        nome,
        descricaoCurso,
        duracao,
        pontuacao,
        formadorId: formadorObj.id,
        categoriaId: categoriaObj.id,
        areaId: areaObj.id,
        topicoId: topicoObj.id,
      });
      res.json(curso);
    } else {
      res.status(404).json({ erro: "Curso não encontrado." });
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar curso.", details: err.message });
  }
};

// Apagar curso
controllers.curso_delete = async (req, res) => {
  const { id } = req.params;

  try {
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res.status(404).json({ error: "Curso não encontrado" });
    }

    await curso.destroy(); 

    res.json({ success: true, message: "Curso apagado com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao apagar o curso", details: err.message});
  }
};

module.exports = controllers;