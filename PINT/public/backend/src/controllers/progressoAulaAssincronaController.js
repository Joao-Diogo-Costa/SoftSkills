const ProgressoAulaAssincrona = require("../model/ProgressoAulaAssincrona");
const AulaAssincrona = require("../model/AulaAssincrona");
const Curso = require("../model/Curso");
const Utilizador = require("../model/Utilizador");

const { Op } = require("sequelize");

const controllers = {};

const atualizarStatusConclusaoCurso = async (utilizadorId, cursoId) => {
  try {
    const Inscricao = require("../model/Inscricao");

    const mockReq = { params: { utilizadorId, cursoId } };
    const mockRes = {
      json: (data) => data,
      status: () => mockRes
    };


    const progressoData = await new Promise((resolve, reject) => {
      const originalJson = mockRes.json;
      mockRes.json = (data) => {
        resolve(data);
      };
      
      controllers.getProgressoCurso(mockReq, mockRes).catch(reject);
    });

    if (progressoData.success && progressoData.percentagem === 100) {
      await Inscricao.update(
        { 
          concluido: true, 
          dataConclusao: new Date() 
        },
        {
          where: {
            utilizadorId: utilizadorId,
            cursoId: cursoId
          }
        }
      );
      console.log(`Curso ${cursoId} marcado como concluído para usuário ${utilizadorId}`);
    }
  } catch (error) {
    console.error("Erro ao atualizar status de conclusão:", error);
  }
};

controllers.marcarAulaConcluida = async (req, res) => {
  try {
    const aulaId = req.params.aulaAssincronaId;
    const utilizadorId = req.utilizador.id;

    if (!aulaId) {
      return res.status(400).json({ success: false, message: "ID da aula é obrigatório." });
    }

    const aula = await AulaAssincrona.findByPk(aulaId);
    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula não encontrada." });
    }

    const progressoExistente = await ProgressoAulaAssincrona.findOne({
      where: { utilizadorId, aulaAssincronaId: aulaId },
    });

    if (progressoExistente) {
      return res.status(200).json({ success: true, message: "Aula já estava marcada como concluída." });
    }


    const novoProgresso = await ProgressoAulaAssincrona.create({
      utilizadorId,
      aulaAssincronaId: aulaId,
      cursoId: aula.cursoId,
      dataConclusao: new Date(),
    });


    await atualizarStatusConclusaoCurso(utilizadorId, aula.cursoId);

    res.status(201).json({ 
      success: true, 
      message: "Aula marcada como concluída com sucesso.", 
      data: novoProgresso 
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Erro interno do servidor ao marcar aula como concluída.", 
      details: error.message 
    });
  }
};

// Obter progresso do utilizador num curso
controllers.getProgressoCurso = async (req, res) => {
  try {
    const { utilizadorId, cursoId } = req.params;

    const totalAulas = await AulaAssincrona.count({ where: { cursoId } });
    const aulasConcluidas = await ProgressoAulaAssincrona.count({ where: { utilizadorId, cursoId } });

    res.json({
      success: true,
      totalAulas,
      aulasConcluidas,
      percentagem: totalAulas > 0 ? Math.round((aulasConcluidas / totalAulas) * 100) : 0
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter progresso.", error: error.message });
  }
};

// Listar todas as aulas concluídas por utilizador num curso
controllers.listarAulasConcluidas = async (req, res) => {
  try {
    const { utilizadorId, cursoId } = req.params;

    const progresso = await ProgressoAulaAssincrona.findAll({
      where: { utilizadorId, cursoId },
      include: [{ model: AulaAssincrona }]
    });

    res.json({ success: true, data: progresso });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar aulas concluídas.", error: error.message });
  }
};

// Verificar se aula está concluída por utilizador
controllers.aulaEstaConcluida = async (req, res) => {
  try {
    const { utilizadorId, aulaAssincronaId } = req.params;
    const progresso = await ProgressoAulaAssincrona.findOne({
      where: { utilizadorId, aulaAssincronaId }
    });
    res.json({ success: true, concluida: !!progresso });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao verificar progresso.", error: error.message });
  }
};

module.exports = controllers;