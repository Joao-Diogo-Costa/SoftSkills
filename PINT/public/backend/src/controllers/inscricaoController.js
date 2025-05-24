const Curso = require("../model/Curso");
const Utilizador = require("../model/Utilizador");
const Inscricao = require("../model/Inscricao");
const { Sequelize } = require("sequelize");
const sequelize = require("../model/database");

const controllers = {};

// Listar inscricao
controllers.inscricao_list = async (req, res) => {
  try {
    const inscricoes = await Inscricao.findAll({
      include: [Curso, Utilizador],
      order: [["dataInscricao", "DESC"]],
    });
    res.json({ success: true, data: inscricoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar inscrições.", details: error.message });
  }
};

// Detail inscricao
controllers.inscricao_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const inscricao = await Inscricao.findByPk(id, {
      include: [Curso, Utilizador],
    });

    if (!inscricao) {
      return res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }

    res.json({ success: true, data: inscricao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter inscrição.", details: error.message });
  }
};

// Criar inscricao
controllers.inscricao_create = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { utilizadorId, cursoId } = req.body;

    const curso = await Curso.findByPk(cursoId, { transaction: t });
    if (!curso) {
      await t.rollback();
      return res.status(404).json({ success: false, message: "Curso não encontrado." });
    }

    const hoje = new Date();
    if (curso.dataLimiteInscricao && curso.dataLimiteInscricao < hoje) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Prazo de inscrição expirado." });
    }

    
    const totalInscritos = await Inscricao.count({
      where: { cursoId },
      transaction: t,
    });

    if (curso.vaga !== null && totalInscritos >= curso.vaga) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Não há vagas disponíveis." });
    }

    
    const jaInscrito = await Inscricao.findOne({
      where: { cursoId, utilizadorId },
      transaction: t,
    });

    if (jaInscrito) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Utilizador já está inscrito neste curso." });
    }

    const novaInscricao = await Inscricao.create({
      cursoId,
      utilizadorId,
    }, { transaction: t });

    await t.commit(); 
    res.status(201).json({ success: true, data: novaInscricao });

  } catch (error) {
    await t.rollback(); 
    res.status(500).json({ success: false, message: "Erro ao criar inscrição.", details: error.message });
  }
};

// Atualizar inscricao
controllers.inscricao_update = async (req, res) => {

  const t = await sequelize.transaction();

  try {
    const id = req.params.id;

    const { notaFinal, concluido, dataConclusao, certificadoGerado } = req.body;

    const inscricao = await Inscricao.findByPk(id, { transaction: t });

    if (!inscricao) {
      await t.rollback(); 
      return res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }

    const dadosParaAtualizar = {};
    if (notaFinal !== undefined) dadosParaAtualizar.notaFinal = notaFinal;
    if (concluido !== undefined) dadosParaAtualizar.concluido = concluido;
    if (dataConclusao !== undefined) dadosParaAtualizar.dataConclusao = dataConclusao;
    if (certificadoGerado !== undefined) dadosParaAtualizar.certificadoGerado = certificadoGerado;

    // Se nenhum campo válido para atualização for fornecido
    if (Object.keys(dadosParaAtualizar).length === 0) {
      await t.rollback();
      return res.status(400).json({ success: false, message: "Nenhum campo válido fornecido para atualização." });
    }

    await inscricao.update(dadosParaAtualizar, { transaction: t });

    await t.commit(); 
    res.json({ success: true, message: "Inscrição atualizada com sucesso.", data: inscricao });
  } catch (error) {
    await t.rollback(); 
    res.status(500).json({ success: false, message: "Erro ao atualizar inscrição.", details: error.message });
  }
};


// Apagar inscricao
controllers.inscricao_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const inscricao = await Inscricao.findByPk(id);

    if (!inscricao) {
      return res.status(404).json({ success: false, message: "Inscrição não encontrada." });
    }

    const curso = await Curso.findByPk(inscricao.cursoId);
    if (curso) {
      await curso.update({ vaga: curso.vaga + 1 }); // Devolve a vaga ao curso
    }

    await inscricao.destroy();

    res.json({ success: true, message: "Inscrição removida com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao remover inscrição.", details: error.message });
  }
};

// lista de inscricao por utilizador
controllers.inscricao_list_user = async (req, res) => {
  try {
    const utilizadorId = req.params.utilizadorId;
    const inscricoes = await Inscricao.findAll({
      where: { utilizadorId },
      include: [Curso],
      order: [["dataInscricao", "DESC"]],
    });
    res.json({ success: true, data: inscricoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar inscrições do utilizador.", details: error.message });
  }
};

module.exports = controllers;