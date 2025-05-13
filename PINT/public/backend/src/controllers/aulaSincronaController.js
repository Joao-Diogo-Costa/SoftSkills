// TODO: Associar gestor autenticado quando sistema de login estiver pronto

const AulaSincrona = require("../model/AulaSincrona");
const Gestor = require("../model/Gestor");
const Curso= require("../model/Curso");
const sequelize = require("../model/database");

const controllers = {};

// Listar aulas sincronas
controllers.AulaSincrona_list = async (req, res) => {
  try {
    const aulaSincrona = await AulaSincrona.findAll({
      include: [Curso],
      order: [['dataLancSincrona', 'ASC']],
    });

    res.json({ success: true, data: aulaSincrona });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar aulas sincronas.", error });
  }
};

// Detail aula sincrona
controllers.AulaSincrona_detail = async (req, res) => {
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
    res.status(500).json({ success: false, message: "Erro ao encontrar aula.", error });
  }
};

// Criar aula sincrona
controllers.AulaSincrona_create = async (req, res) => {
  console.log("Corpo da requisição (req.body):", req.body);

  try {
    const { tituloSincrona, descricaoSincrona, dataLancSincrona, vaga, cursoNome } = req.body;

    if (!tituloSincrona || !descricaoSincrona || !dataLancSincrona || !vaga || !cursoNome ) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const curso = await Curso.findOne({ where: { nome: cursoNome } });

    if (!curso) {
      return res.status(404).json({ erro: "Curso não encontrado com esse nome." });
    }


    const novaAulaSincrona = await AulaSincrona.create({
      tituloSincrona,
      descricaoSincrona,
      dataLancSincrona,
      vaga,
      cursoId: curso.id,
    });

    res.status(201).json(novaAulaSincrona);
  } catch (err) {
    console.error("Erro ao criar curso:", err); // Exibe detalhes no console
    res.status(500).json({ erro: "Erro ao criar curso.", details: err.message });
  }
};

// Atualizar aula sincrona
controllers.AulaSincrona_update = async (req, res) => {
  try {
    const { tituloSincrona, descricaoSincrona, dataLancSincrona, vaga, cursoNome } = req.body;
    const aulaSincrona = await AulaSincrona.findByPk(req.params.id);

    const curso = await Curso.findOne({ where: { nome: cursoNome } });
    if (!curso) {
    return res.status(404).json({ erro: "Curso não encontrado com esse nome." });
    }

    if (aulaSincrona) {
      await aulaSincrona.update({
        tituloSincrona, 
        descricaoSincrona, 
        dataLancSincrona, 
        vaga, 
        cursoId: curso.id,
      });
      res.json(aulaSincrona);
    } else {
      res.status(404).json({ erro: "Aula não encontrada." });
    }
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar aula sincrona.", details: err.message });
  }
};

// Apagar curso
controllers.AulaSincrona_delete = async (req, res) => {
  const { id } = req.params;

  try {
    const aulaSincrona = await AulaSincrona.findByPk(id);

    if (!aulaSincrona) {
      return res.status(404).json({ error: "Aula sincrona não encontrada" });
    }

    await aulaSincrona.destroy(); 

    res.json({ success: true, message: "Aula sincrona apagada com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao apagar o aula sincrona" });
  }
};

module.exports = controllers;