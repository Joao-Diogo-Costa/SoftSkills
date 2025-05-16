// TODO: Associar gestor autenticado quando sistema de login estiver pronto

const AulaSincrona = require("../model/AulaSincrona");
const Gestor = require("../model/Gestor");
const Curso= require("../model/Curso");
const sequelize = require("../model/database");

const controllers = {};

// Listar aulas sincronas
controllers.aulaSincrona_list = async (req, res) => {
  try {
    const aulaSincrona = await AulaSincrona.findAll({
      include: [Curso],
      order: [['dataLancSincrona', 'ASC']],
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

    const aulaSincrona = await AulaSincrona.findByPk(id, {
      include: [Curso],
    });

    if (aulaSincrona) {
      res.json({ success: true, data: aulaSincrona });
    } else {
      res.status(404).json({ success: false, message: "Aula não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao encontrar aula.", details: error.message});
  }
};

// Criar aula sincrona
controllers.aulaSincrona_create = async (req, res) => {
  console.log("Corpo da requisição (req.body):", req.body);

  try {
    const { tituloSincrona, descricaoSincrona, dataLancSincrona, vaga, cursoId } = req.body;

    if (!tituloSincrona || !descricaoSincrona || !dataLancSincrona || !vaga || !cursoId) {
      return res.status(400).json({ message: "Campos obrigatórios em falta." });
    }

    const cursoExiste = await Curso.findByPk(cursoId);
    if (!cursoExiste) {
      return res.status(404).json({ message: "Curso não encontrado com esse ID." });
    }

    const novaAulaSincrona = await AulaSincrona.create({
      tituloSincrona,
      descricaoSincrona,
      dataLancSincrona,
      vaga,
      cursoId,
    });

    res.status(201).json(novaAulaSincrona);
  } catch (error) {
    console.error("Erro ao criar curso:", error); 
    res.status(500).json({ message: "Erro ao criar curso.", details: error.message });
  }
};

// Atualizar aula sincrona
controllers.aulaSincrona_update = async (req, res) => {
  try {
    const { tituloSincrona, descricaoSincrona, dataLancSincrona, vaga, cursoId} = req.body;
    const aulaSincrona = await AulaSincrona.findByPk(req.params.id);

    const cursoExiste = await Curso.findByPk(cursoId);
    if (!cursoExiste) {
      return res.status(404).json({ message: "Curso não encontrado com esse ID." });
    }

    if (aulaSincrona) {
      await aulaSincrona.update({
        tituloSincrona, 
        descricaoSincrona, 
        dataLancSincrona, 
        vaga, 
        cursoId,
      });
      res.json(aulaSincrona);
    } else {
      res.status(404).json({ message: "Aula não encontrada." });
    }
  } catch (error) {
    res.status(500).json({  message: "Erro ao atualizar aula sincrona.", details: error.message });
  }
};

// Apagar curso
controllers.aulaSincrona_delete = async (req, res) => {
  const { id } = req.params;

  try {
    const aulaSincrona = await AulaSincrona.findByPk(id);

    if (!aulaSincrona) {
      return res.status(404).json({ error: "Aula sincrona não encontrada" });
    }

    await aulaSincrona.destroy(); 

    res.json({ success: true, message: "Aula sincrona apagada com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao apagar o aula sincrona", details: error.message });
  }
};

module.exports = controllers;