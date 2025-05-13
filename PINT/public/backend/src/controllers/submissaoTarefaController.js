const SubmissaoTarefa = require("../model/SubmissaoTarefa");
const Tarefa = require("../model/Tarefa");

const controllers = {};

// Listar Submissões
controllers.submissao_list = async (req, res) => {
  try {
    const submissoes = await SubmissaoTarefa.findAll({
      include: [Tarefa],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: submissoes });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao listar submissões.", error });
  }
};

// Detalhe da Submissão
controllers.submissao_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const submissao = await SubmissaoTarefa.findByPk(id, {
      include: [Tarefa],
    });

    if (submissao) {
      res.json({ success: true, data: submissao });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Submissão não encontrada." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar submissão.", error });
  }
};

// Criar Submissão
controllers.submissao_create = async (req, res) => {
  try {
    const { fichEntrega, dataEntrega, nota, idTarefa } = req.body;

    if (!idTarefa) {
      return res.status(400).json({ erro: "ID da tarefa é obrigatório." });
    }

    const tarefa = await Tarefa.findByPk(idTarefa);

    if (!tarefa) {
      return res
        .status(404)
        .json({ erro: "Tarefa não encontrada com esse ID." });
    }

    const novaSubmissao = await SubmissaoTarefa.create({
      fichEntrega,
      dataEntrega,
      nota,
      idTarefa,
    });

    res.status(201).json({ success: true, data: novaSubmissao });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erro ao criar submissão.",
        details: error.message,
      });
  }
};

// Atualizar Submissão
controllers.submissao_update = async (req, res) => {
  try {
    const { fichEntrega, dataEntrega, nota, idTarefa } = req.body;
    const id = req.params.id;

    const submissao = await SubmissaoTarefa.findByPk(id);

    if (!submissao) {
      return res.status(404).json({ erro: "Submissão não encontrada." });
    }

    if (idTarefa) {
      const tarefa = await Tarefa.findByPk(idTarefa);
      if (!tarefa) {
        return res
          .status(404)
          .json({ erro: "Tarefa não encontrada com esse ID." });
      }
    }

    await submissao.update({
      fichEntrega,
      dataEntrega,
      nota,
      idTarefa,
    });

    res.json({ success: true, data: submissao });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar submissão.", details: error.message });
  }
};

// Apagar Submissão
controllers.submissao_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const submissao = await SubmissaoTarefa.findByPk(id);

    if (!submissao) {
      return res.status(404).json({ error: "Submissão não encontrada." });
    }

    await submissao.destroy();

    res.json({ success: true, message: "Submissão apagada com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao apagar submissão.", details: error.message });
  }
};

module.exports = controllers;