const Gestor = require("../model/Gestor");
const Curso = require("../model/Curso");
const CursoGestor = require("../model/CursoGestor");

const controllers = {};

// Listar gestores com os cursos associados
controllers.gestor_list = async (req, res) => {
  try {
    const gestor = await Gestor.findAll({
      include: Curso,
      order: [["nome", "ASC"]],
    });

    res.json({ success: true, data: gestor });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao listar gestores.", error });
  }
};

// Detalhe de um gestor específico
controllers.gestor_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const gestor = await Gestor.findByPk(id, {
      include: Curso,
    });

    if (gestor) {
      res.json({ success: true, data: gestor });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Gestor não encontrado." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar gestor.", error });
  }
};

// Criar novo gestor e associar a cursos
controllers.gestor_create = async (req, res) => {
  try {
    const { nome, dataNascimento, telefone, cursosIds } = req.body;

    if (!nome || !dataNascimento || !telefone) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const novoGestor = await Gestor.create({ nome, dataNascimento, telefone });

    if (cursosIds && cursosIds.length > 0) {
      await novoGestor.setCursos(cursosIds);
    }

    res.status(201).json({ success: true, data: novoGestor });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao criar gestor.", details: err.message });
  }
};

// Atualizar gestor
controllers.gestor_update = async (req, res) => {
  try {
    const { nome, dataNascimento, telefone, cursosIds } = req.body;
    const gestor = await Gestor.findByPk(req.params.id);

    if (!gestor) {
      return res.status(404).json({ erro: "Gestor não encontrado." });
    }

    await gestor.update({ nome, dataNascimento, telefone });

    if (cursosIds && cursosIds.length > 0) {
      await gestor.setCursos(cursosIds);
    }

    res.json({ success: true, data: gestor });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar gestor.", details: err.message });
  }
};

// Apagar gestor
controllers.gestor_delete = async (req, res) => {
  try {
    const gestor = await Gestor.findByPk(req.params.id);

    if (!gestor) {
      return res.status(404).json({ erro: "Gestor não encontrado." });
    }

    await gestor.setCursos([]); // Remove associações
    await gestor.destroy();

    res.json({ success: true, message: "Gestor apagado com sucesso." });
  } catch (err) {
    res
      .status(500)
      .json({ erro: "Erro ao apagar gestor.", details: err.message });
  }
};

module.exports = controllers;
