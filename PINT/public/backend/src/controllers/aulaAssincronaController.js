const AulaAssincrona = require("../model/AulaAssincrona");
const Gestor = require("../model/Gestor");
const Curso = require("../model/Curso");

const controllers = {};

// Listar todas as aulas assíncronas
controllers.aulaAssincrona_list = async (req, res) => {
  try {
    const aulas = await AulaAssincrona.findAll({
      include: [Gestor, Curso],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: aulas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar aulas assíncronas.", error });
  }
};

// Detalhe de uma aula assíncrona
controllers.aulaAssincrona_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const aula = await AulaAssincrona.findByPk(id, {
      include: [Gestor, Curso],
    });

    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula assíncrona não encontrada." });
    }

    res.json({ success: true, data: aula });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar aula assíncrona.", error });
  }
};

// Criar nova aula assíncrona
controllers.aulaAssincrona_create = async (req, res) => {
  try {
    const {
      vaga,
      descricaoAssincrona,
      tituloAssincrona,
      dataLancAssincrona,
      gestorId,
      cursoId,
    } = req.body;

    if (!vaga || !descricaoAssincrona || !tituloAssincrona || !dataLancAssincrona || !gestorId || !cursoId) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const gestorExiste = await Gestor.findByPk(gestorId);
    if (!gestorExiste) {
      return res.status(400).json({ success: false, message: "ID de Gestor inválido." });
    }

    const cursoExiste = await Curso.findByPk(cursoId);
    if (!cursoExiste) {
      return res.status(400).json({ success: false, message: "ID de Curso inválido." });
    }

    const novaAula = await AulaAssincrona.create({
      vaga,
      descricaoAssincrona,
      tituloAssincrona,
      dataLancAssincrona,
      gestorId,
      cursoId,
    });

    res.status(201).json({ success: true, data: novaAula });
  } catch (error) {
    console.error("Erro ao criar aula assíncrona:", error);
    res.status(500).json({ success: false, message: "Erro ao criar aula assíncrona.", error: error.message });
  }
};

// Atualizar aula assíncrona
controllers.aulaAssincrona_update = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      vaga,
      descricaoAssincrona,
      tituloAssincrona,
      dataLancAssincrona,
      gestorId,
      cursoId,
    } = req.body;

    const aula = await AulaAssincrona.findByPk(id);
    if (!aula) {
      return res.status(404).json({ message: "Aula assíncrona não encontrada." });
    }

    const gestorExiste = await Gestor.findByPk(gestorId);
    if (!gestorExiste) {
      return res.status(400).json({ success: false, message: "ID de Gestor inválido." });
    }

    const cursoExiste = await Curso.findByPk(cursoId);
    if (!cursoExiste) {
      return res.status(400).json({ success: false, message: "ID de Curso inválido." });
    }

    await aula.update({
      vaga,
      descricaoAssincrona,
      tituloAssincrona,
      dataLancAssincrona,
      gestorId,
      cursoId,
    });

    res.json({ success: true, data: aula });
  } catch (error) {
    console.error("Erro ao atualizar aula assíncrona:", error);
    res.status(500).json({message: "Erro ao atualizar aula assíncrona.", details: error.message });
  }
};

// Apagar aula assíncrona
controllers.aulaAssincrona_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const aula = await AulaAssincrona.findByPk(id);
    if (!aula) {
      return res.status(404).json({ error: "Aula assíncrona não encontrada." });
    }

    await aula.destroy();

    res.json({ success: true, message: "Aula assíncrona apagada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar aula assíncrona.", details: error.message });
  }
};

module.exports = controllers;
