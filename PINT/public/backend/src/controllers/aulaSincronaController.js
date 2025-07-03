const AulaSincrona = require("../model/AulaSincrona");
const Curso= require("../model/Curso");
const sequelize = require("../model/database");

const controllers = {};

// Listar aulas sincronas
controllers.aulaSincrona_list = async (req, res) => {
  try {
    const aulaSincrona = await AulaSincrona.findAll({
      include: [Curso],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: aulaSincrona });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar aulas sincronas.", details: error.message });
  }
};

// Detail aula sincrona
controllers.aulaSincrona_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const aula = await AulaSincrona.findByPk(id, { include: [Curso] });

    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula não encontrada." });
    }

    res.json({ success: true, data: aula });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao obter detalhes da aula.", details: error.message,});
  }
};

// Criar aula sincrona
controllers.aulaSincrona_create = async (req, res) => {
  try {
    const { tituloSincrona, descricaoSincrona, dataLancSincrona, cursoId } = req.body;

    if (!tituloSincrona || !descricaoSincrona || !dataLancSincrona || !vaga || !cursoId) {
      return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios." });
    }

    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(400).json({ success: false, message: "ID de curso inválido." });
    }

    const novaAula = await AulaSincrona.create({
      tituloSincrona,
      descricaoSincrona,
      dataLancSincrona,
      cursoId,
    });

    res.status(201).json({ success: true, data: novaAula });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao criar aula síncrona.", details: error.message});
  }
};

// Atualizar aula sincrona
controllers.aulaSincrona_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { tituloSincrona, descricaoSincrona, dataLancSincrona, cursoId } = req.body;

    const aula = await AulaSincrona.findByPk(id);
    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula não encontrada." });
    }

    if (cursoId) {
      const curso = await Curso.findByPk(cursoId);
      if (!curso) {
        return res.status(400).json({ success: false, message: "ID de curso inválido." });
      }
    }

    await aula.update({
      tituloSincrona,
      descricaoSincrona,
      dataLancSincrona,
      cursoId,
    });

    res.json({ success: true, data: aula });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar aula síncrona.",
      details: error.message,
    });
  }
};

// Apagar curso
controllers.aulaSincrona_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const aula = await AulaSincrona.findByPk(id);

    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula não encontrada." });
    }

    await aula.destroy();
    res.json({ success: true, message: "Aula sincrona apagada com sucesso." });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao apagar aula síncrona.", details: error.message,});
  }
}

// Listar aulas síncronas de um curso específico
controllers.aulaSincrona_listByCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;

    const aulas = await AulaSincrona.findAll({
      where: { cursoId }, 
      include: [Curso],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: aulas });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao listar aulas síncronas do curso.",details: error.message, });
  }
};


module.exports = controllers;