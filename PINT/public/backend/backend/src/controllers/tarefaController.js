const Tarefa = require("../model/Tarefa");
const SubmissaoTarefa = require("../model/SubmissaoTarefa");
const AulaSincrona = require("../model/AulaSincrona");

const controllers = {};

// Listar Tarefas
controllers.tarefa_list = async (req, res) => {
  try {
    const tarefas = await Tarefa.findAll({
      include: [SubmissaoTarefa, AulaSincrona],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: tarefas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar tarefas.", error });
  }
};

// Detail Tarefa
controllers.tarefa_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const tarefa = await Tarefa.findByPk(id, {
      include: [SubmissaoTarefa, AulaSincrona],
    });

    if (!tarefa) {
      return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
    }

    res.json({ success: true, data: tarefa });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar tarefa.", error });
  }
};

// Criar Tarefa
controllers.tarefa_create = async (req, res) => {
  try {
    const { titulo, descricao, dataLimite, ficheiroEnunciado, idSub, idAulaSinc } = req.body;

    if (!titulo || !descricao || !dataLimite) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const novaTarefa = await Tarefa.create({
      titulo,
      descricao,
      dataLimite,
      ficheiroEnunciado,
      idSub,
      idAulaSinc,
    });

    res.status(201).json({ success: true, data: novaTarefa });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar tarefa.", error: error.message });
  }
};

// Atualizar Tarefa
controllers.tarefa_update = async (req, res) => {
  try {
    const { titulo, descricao, dataLimite, ficheiroEnunciado, idSub, idAulaSinc } = req.body;
    const id = req.params.id;

    const tarefa = await Tarefa.findByPk(id);
    if (!tarefa) {
      return res.status(404).json({ erro: "Tarefa não encontrada." });
    }

    await tarefa.update({
      titulo,
      descricao,
      dataLimite,
      ficheiroEnunciado,
      idSub,
      idAulaSinc,
    });

    res.json({ success: true, data: tarefa });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar tarefa.", details: error.message });
  }
};

// Delete Tarefa
controllers.tarefa_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const tarefa = await Tarefa.findByPk(id);
    if (!tarefa) {
      return res.status(404).json({ error: "Tarefa não encontrada." });
    }

    await tarefa.destroy();

    res.json({ success: true, message: "Tarefa apagada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar tarefa.", details: error.message });
  }
};

module.exports = controllers;
