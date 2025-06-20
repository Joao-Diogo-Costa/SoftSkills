const AulaAssincrona = require("../model/AulaAssincrona");
const Curso = require("../model/Curso");
const DocumentoAula = require("../model/DocumentoAula");

const controllers = {};

// Listar todas as aulas assíncronas
controllers.aulaAssincrona_list = async (req, res) => {
  try {
    const aulas = await AulaAssincrona.findAll({
      include: [
        Curso,
        {
          model: DocumentoAula,
          as: "ficheiros",
        }
      ],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: aulas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar aulas assíncronas.", error });
  }
};

// Detail aula assíncrona
controllers.aulaAssincrona_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const aula = await AulaAssincrona.findByPk(id, {
      include: [Curso],
    });

    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula assíncrona não encontrada." });
    }

    res.json({ success: true, data: aula });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter aula assíncrona.", details: error.message });
  }
};

// Criar aula assíncrona
controllers.aulaAssincrona_create = async (req, res) => {
  console.log("Corpo da requisição:", req.body);
  try {
    const {tituloAssincrona, descricaoAssincrona, dataLancAssincrona, cursoId } = req.body;

    if ( !tituloAssincrona || !descricaoAssincrona || !dataLancAssincrona || !cursoId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
    }

    const cursoExiste = await Curso.findByPk(cursoId);
    if (!cursoExiste) {
      return res.status(400).json({ success: false, message: "ID de Curso inválido." });
    }

    const novaAula = await AulaAssincrona.create({
      tituloAssincrona,
      descricaoAssincrona,
      dataLancAssincrona,
      cursoId,
    });

    res.status(201).json({ success: true, data: novaAula });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar aula assíncrona.", details: error.message });
  }
};

// Atualizar aula assíncrona
controllers.aulaAssincrona_update = async (req, res) => {
  try {
    const { tituloAssincrona, descricaoAssincrona, dataLancAssincrona, cursoId } = req.body;

    const aula = await AulaAssincrona.findByPk(req.params.id);

    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula assíncrona não encontrada." });
    }

    if (cursoId) {
      const cursoExiste = await Curso.findByPk(cursoId);
      if (!cursoExiste) {
        return res.status(400).json({ success: false, message: "ID de Curso inválido." });
      }
    }

    await aula.update({
      tituloAssincrona,
      descricaoAssincrona,
      dataLancAssincrona,
      cursoId,
    });

    res.json({ success: true, data: aula });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar aula assíncrona.", details: error.message });
  }
};

// Apagar aula assíncrona
controllers.aulaAssincrona_delete = async (req, res) => {
  try {
    const aula = await AulaAssincrona.findByPk(req.params.id);

    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula assíncrona não encontrada." });
    }

    await aula.destroy();

    res.json({ success: true, message: "Aula assíncrona apagada com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao apagar aula assíncrona.", details: error.message });
  }
};

// listar aulas assincronas por curso
controllers.aulaAssincrona_listByCurso = async (req, res) => {
  try {
    const cursoId = req.params.cursoId; 

    const aulas = await AulaAssincrona.findAll({
      where: { cursoId }, 
      include: [Curso],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: aulas });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao listar aulas assíncronas do curso.", error: error.message,});
  }
};

module.exports = controllers;
