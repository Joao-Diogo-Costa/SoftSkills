const Tarefa = require("../model/Tarefa");
const AulaSincrona = require("../model/AulaSincrona");

const controllers = {};

// Listar Tarefas
controllers.tarefa_list = async (req, res) => {
  try {
    const tarefas = await Tarefa.findAll({
      include: [AulaSincrona],
      order: [["dataLimite", "ASC"]],
    });
    res.json({ success: true, data: tarefas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar tarefas.", details: error.message,});
  }
};

// Detail Tarefa
controllers.tarefa_detail = async (req, res) => {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id, {
      include: [AulaSincrona],
    });

    if (!tarefa) {
      return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
    }

    res.json({ success: true, data: tarefa });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar tarefa.", details: error.message,});
  }
};

// Criar Tarefa
controllers.tarefa_create = async (req, res) => {
  try {
    const { titulo, descricao, dataLimite, ficheiroEnunciado, idAulaSinc } = req.body;

    if (!titulo || !descricao || !dataLimite) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios em falta." });
    }

    if (idAulaSinc) {
      const aulaSincronaExiste = await AulaSincrona.findByPk(idAulaSinc);
      if (!aulaSincronaExiste) {
        return res.status(400).json({ success: false, message: "ID de Aula Síncrona inválido." });
      }
    }

    const novaTarefa = await Tarefa.create({
      titulo,
      descricao,
      dataLimite,
      ficheiroEnunciado,
      idAulaSinc,
    });

    res.status(201).json({ success: true, data: novaTarefa });
  } catch (error) {
    res.status(500).json({ success: false,message: "Erro ao criar tarefa.",  details: error.message,});
  }
};

// Atualizar Tarefa
controllers.tarefa_update = async (req, res) => {
  try {
    const { titulo, descricao, dataLimite, ficheiroEnunciado, idAulaSinc } = req.body;
    const tarefa = await Tarefa.findByPk(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
    }

    if (idAulaSinc) {
      const aulaSincronaExiste = await AulaSincrona.findByPk(idAulaSinc);
      if (!aulaSincronaExiste) {
        return res.status(400).json({ success: false, message: "ID de Aula Síncrona inválido." });
      }
    }

    await tarefa.update({
      titulo: titulo ?? tarefa.titulo,
      descricao: descricao ?? tarefa.descricao,
      dataLimite: dataLimite ?? tarefa.dataLimite,
      ficheiroEnunciado: ficheiroEnunciado ?? tarefa.ficheiroEnunciado,
      idAulaSinc: idAulaSinc ?? tarefa.idAulaSinc,
    });

    res.json({ success: true, data: tarefa });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar tarefa.",details: error.message,});
  }
};

// Delete Tarefa
controllers.tarefa_delete = async (req, res) => {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
    }

    await tarefa.destroy();
    res.json({ success: true, message: "Tarefa eliminada com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao eliminar tarefa.", details: error.message, });
  }
};

module.exports = controllers;
