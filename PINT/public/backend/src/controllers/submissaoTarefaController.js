const SubmissaoTarefa = require("../model/SubmissaoTarefa");
const Utilizador = require("../model/Utilizador");
const Tarefa = require("../model/Tarefa");

const controllers = {};

// Listar Submissões
controllers.submissao_list = async (req, res) => {
  try {
    const lista = await SubmissaoTarefa.findAll({
      include: [Utilizador, Tarefa],
      order: [["dataEntrega", "DESC"]],
    });
    res.json({ success: true, data: lista });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar submissões.",details: error.message,});
  }
};


// Detalhe da Submissão
controllers.submissao_detail = async (req, res) => {
  try {
    const submissao = await SubmissaoTarefa.findByPk(req.params.id, {
      include: [Utilizador, Tarefa],
    });

    if (!submissao) {
      return res.status(404).json({ success: false, message: "Submissão não encontrada." });
    }

    res.json({ success: true, data: submissao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter submissão.", details: error.message,});
  }
};

// Criar Submissão
controllers.submissao_create = async (req, res) => {
  try {
    const { fichEntrega, dataEntrega, nota, utilizadorId, idTarefa } = req.body;

    if (!utilizadorId || !idTarefa) {
      return res.status(400).json({ success: false, message: "Utilizador e Tarefa são obrigatórios." });
    }

    const utilizador = await Utilizador.findByPk(utilizadorId);
    const tarefa = await Tarefa.findByPk(idTarefa);

    if (!utilizador || !tarefa) {
      return res.status(400).json({ success: false, message: "Utilizador ou Tarefa inválida." });
    }

    const novaSubmissao = await SubmissaoTarefa.create({
      fichEntrega,
      dataEntrega,
      nota,
      utilizadorId,
      idTarefa,
    });

    res.status(201).json({ success: true, data: novaSubmissao });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao criar submissão.",details: error.message, });
  }
};

// Atualizar Submissão
controllers.submissao_update = async (req, res) => {
  try {
    const { fichEntrega, dataEntrega, nota } = req.body;
    const submissao = await SubmissaoTarefa.findByPk(req.params.id);

    if (!submissao) {
      return res.status(404).json({ success: false, message: "Submissão não encontrada." });
    }

    await submissao.update({
      fichEntrega: fichEntrega ?? submissao.fichEntrega,
      dataEntrega: dataEntrega ?? submissao.dataEntrega,
      nota: nota ?? submissao.nota,
    });

    res.json({ success: true, data: submissao });
  } catch (error) {
    res.status(500).json({ success: false,  message: "Erro ao atualizar submissão.", details: error.message, });
  }
};

// Apagar Submissão
controllers.submissao_delete = async (req, res) => {
  try {
    const submissao = await SubmissaoTarefa.findByPk(req.params.id);

    if (!submissao) {
      return res.status(404).json({ success: false, message: "Submissão não encontrada." });
    }

    await submissao.destroy();
    res.json({ success: true, message: "Submissão removida com sucesso." });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao remover submissão.", details: error.message, });
  }
};

module.exports = controllers;