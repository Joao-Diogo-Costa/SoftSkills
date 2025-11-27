const Tarefa = require("../model/Tarefa");
const Curso = require("../model/Curso");
const Utilizador = require("../model/Utilizador");
const TarefaFicheiro = require("../model/TarefaFicheiro");
const Inscricao = require("../model/Inscricao"); 
const Notificacao = require("../model/Notificacao");
const admin = require('firebase-admin');
const fs = require('fs');

let serviceAccount;
if (fs.existsSync('/etc/secrets/serviceAccountKey.json')) {
    serviceAccount = require('/etc/secrets/serviceAccountKey.json');
} 
else {
    serviceAccount = require('../config/serviceAccountKey.json');
}


const controllers = {};

// Listar Tarefas
controllers.tarefa_list = async (req, res) => {
  try {
    const tarefas = await Tarefa.findAll({
      include: [
        Curso,
        {
          model: TarefaFicheiro,
          as: "ficheiros"
        }
      ],
      order: [["dataLimite", "ASC"]],
    });
    res.json({ success: true, data: tarefas });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar tarefas.", details: error.message });
  }
};


// Detail Tarefa
controllers.tarefa_detail = async (req, res) => {
  try {
    const tarefa = await Tarefa.findByPk(req.params.id, {
      include: [
        Curso,
        {
          model: TarefaFicheiro,
          as: "ficheiros"
        }
      ],
    });

    if (!tarefa) {
      return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
    }

    res.json({ success: true, data: tarefa });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar tarefa.", details: error.message });
  }
};

// Criar Tarefa
controllers.tarefa_create = async (req, res) => {
  try {
    const { titulo, descricao, dataLimite, utilizadorId, cursoId } = req.body;

    if (!titulo || !descricao || !dataLimite || !utilizadorId || !cursoId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios em falta." });
    }

    if (cursoId) {
      const cursoIdExiste = await Curso.findByPk(cursoId);
      if (!cursoIdExiste) {
        return res.status(400).json({ success: false, message: "ID de curso inválido." });
      }
    }

    const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
    if (!utilizadorExiste) {
      return res.status(400).json({ success: false, message: "ID de utilizador inválido ou utilizador não encontrado." });
    }

    const novaTarefa = await Tarefa.create({
      titulo,
      descricao,
      dataLimite,
      utilizadorId,
      cursoId,
    });
    
    try {
      const inscricoesDoCurso = await Inscricao.findAll({
        where: { cursoId },
        attributes: ["utilizadorId"],
      });

      const utilizadoresIds = inscricoesDoCurso.map(i => i.utilizadorId);
      const utilizadores = await Utilizador.findAll({
        where: { id: utilizadoresIds },
        attributes: ["email", "nomeUtilizador", "tokenFCM"],
      });

      // Criar notificações na base de dados
      for (const inscricao of inscricoesDoCurso) {
        await Notificacao.create({
          utilizadorId: inscricao.utilizadorId,
          titulo: `Nova tarefa: ${titulo}`,
          mensagem: `"${descricao.substring(0, 100)}..."`,
          dataEnvio: new Date(),
          lida: false,
          cursoId: cursoId,
          tipo: "nova_tarefa",
        });
      }

      // Enviar notificações push
      const tokens = utilizadores.map(u => u.tokenFCM).filter(Boolean);
      if (tokens.length > 0) {
        for (const token of tokens) {
          const message = {
            notification: {
              title: `Nova tarefa: ${titulo}`,
              body: descricao.substring(0, 100) + "...",
            },
            token: token,
          };
          await admin.messaging().send(message);
        }
      }
    } catch (pushError) {
      console.error("Erro ao enviar push notification de tarefa:", pushError);
    }

    res.status(201).json({ success: true, data: novaTarefa });
  } catch (error) {
    res.status(500).json({ success: false,message: "Erro ao criar tarefa.",  details: error.message,});
  }
};

// Atualizar Tarefa
controllers.tarefa_update = async (req, res) => {
  try {
    const { titulo, descricao, dataLimite, cursoId } = req.body;
    const tarefa = await Tarefa.findByPk(req.params.id);

    if (!tarefa) {
      return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
    }

    if (cursoId !== undefined && cursoId !== null) {
      const cursoExiste = await Curso.findByPk(cursoId);
      if (!cursoExiste) {
        return res.status(400).json({ success: false, message: "ID de Curso inválido." });
      }
    }

    await tarefa.update({
      titulo: titulo ?? tarefa.titulo,
      descricao: descricao ?? tarefa.descricao,
      dataLimite: dataLimite ?? tarefa.dataLimite,
      cursoId: cursoId ?? tarefa.cursoId,
    });

    res.json({ success: true, data: tarefa });
  } catch (error) {
    console.error("Erro ao atualizar tarefa:", error);
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

