const Curso = require("../model/Curso");
const AvaliacaoCursoUtilizador = require("../model/AvaliacaoCursoUtilizador");
const Inscricao = require("../model/Inscricao");
const Utilizador = require("../model/Utilizador");
const { Sequelize } = require("sequelize");

const controllers = {};

// Listar avaliações
controllers.avaliacao_list = async (req, res) => {
  try {
    const avaliacoes = await AvaliacaoCursoUtilizador.findAll({
      include: [Curso, Utilizador],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: avaliacoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar avaliações.", details: error.message, });
  }
};

controllers.media_avaliacao_curso = async (req, res) => {
  try {
    const cursoId = req.params.cursoId;
    const mediaArr = await AvaliacaoCursoUtilizador.findAll({
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col('"NOTA"')), "mediaNota"],
        [Sequelize.fn("COUNT", Sequelize.col('"ID_AVALIACAO"')), "totalAvaliacoes"]
      ],
      where: { cursoId },
      include: [{ model: Curso, attributes: ["nome"] }],
      group: [
        '"AVALIACAO_CURSO_UTILIZADOR"."ID_CURSO"',
        '"CURSO"."ID_CURSO"',
        '"CURSO"."NOMECURSO"'
      ]
    });

    let media = mediaArr && mediaArr[0] ? mediaArr[0].toJSON() : null;
    if (media && media.mediaNota !== null) {
      media.mediaNota = parseFloat(media.mediaNota).toFixed(1);
    }

    res.json({ success: true, data: media });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao calcular média.", details: error.message });
  }
};

// Detail avaliação
controllers.avaliacao_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const avaliacao = await AvaliacaoCursoUtilizador.findByPk(id, {
      include: [Curso, Utilizador],
    });

    if (!avaliacao) {
      return res.status(404).json({ success: false, message: "Avaliação não encontrada." });
    }

    res.json({ success: true, data: avaliacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar avaliação.", details: error.message, });
  }
};
// Criar avaliação
controllers.avaliacao_create = async (req, res) => {
  try {
    const { nota, utilizadorId, cursoId, dataAvaliacao } = req.body;

    console.log("=== DEBUG AVALIAÇÃO ===");
    console.log("Dados recebidos:", { nota, utilizadorId, cursoId });

    if (!nota || !utilizadorId || !cursoId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ success: false, message: "A nota deve estar entre 1 e 5." });
    }

    const curso = await Curso.findByPk(cursoId);
    const utilizador = await Utilizador.findByPk(utilizadorId);

    console.log("Curso encontrado:", curso?.dataValues);
    console.log("Utilizador encontrado:", utilizador?.nomeUtilizador);

    if (!curso) {
      return res.status(404).json({ success: false, message: "ID de curso inválido." });
    }

    if (!utilizador) {
      return res.status(404).json({ success: false, message: "ID de utilizador inválido." });
    }

    const inscricao = await Inscricao.findOne({
      where: {
        utilizadorId: utilizadorId,
        cursoId: cursoId,
      },
    });

    console.log("Inscrição encontrada:", inscricao?.dataValues);

    if (!inscricao) {
      return res.status(404).json({ success: false, message: "Inscrição do utilizador neste curso não encontrada." });
    }

    console.log("Tipo de curso:", curso.tipoCurso);
    console.log("Nota final da inscrição:", inscricao.notaFinal);
    console.log("Concluído:", inscricao.concluido);

    if (curso.tipoCurso === 'Presencial') {

      console.log("Verificando curso presencial...");
      if (!inscricao.notaFinal) {
        console.log("ERRO: Curso presencial sem nota final");
        return res.status(403).json({
          success: false,
          message: "Para cursos presenciais, a avaliação só pode ser feita após a atribuição da nota final."
        });
      }
    } else {

      console.log("Verificando curso online...");
      if (!inscricao.concluido) {
        console.log("ERRO: Curso online não concluído");
        return res.status(403).json({
          success: false,
          message: "Para cursos online, a avaliação só pode ser feita após a conclusão."
        });
      }
    }

    const avaliacaoExistente = await AvaliacaoCursoUtilizador.findOne({
      where: {
        utilizadorId: utilizadorId,
        cursoId: cursoId,
      },
    });

    console.log("Avaliação existente:", avaliacaoExistente?.dataValues);

    if (avaliacaoExistente) {
      return res.status(400).json({ success: false, message: "Já existe uma avaliação para este curso. Use o endpoint de atualização." });
    }

    console.log("Criando nova avaliação...");
    const novaAvaliacao = await AvaliacaoCursoUtilizador.create({
      nota,
      cursoId,
      utilizadorId,
      dataAvaliacao: dataAvaliacao || new Date(),
    });

    console.log("Avaliação criada com sucesso:", novaAvaliacao.dataValues);
    res.status(201).json({ success: true, data: novaAvaliacao });
  } catch (error) {
    console.error("Erro completo:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao criar avaliação.",
      details: error.message,
    });
  }
};

// Atualizar avaliação
controllers.avaliacao_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nota, cursoId, utilizadorId, dataAvaliacao } = req.body;

    const avaliacao = await AvaliacaoCursoUtilizador.findByPk(id);
    if (!avaliacao) {
      return res.status(404).json({ success: false, message: "Avaliação não encontrada." });
    }

    if (nota && (nota < 1 || nota > 5)) {
      return res.status(400).json({ success: false, message: "A nota deve estar entre 1 e 5." });
    }

    if (cursoId) {
      const curso = await Curso.findByPk(cursoId);
      if (!curso) {
        return res.status(400).json({ success: false, message: "ID de curso inválido." });
      }
    }

    if (utilizadorId) {
      const utilizador = await Utilizador.findByPk(utilizadorId);
      if (!utilizador) {
        return res.status(400).json({ success: false, message: "ID de utilizador inválido." });
      }
    }

    await avaliacao.update({
      nota,
      cursoId,
      utilizadorId,
      dataAvaliacao,
    });

    res.json({ success: true, data: avaliacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar avaliação.", details: error.message, });
  }
};

// Apagar avaliação
controllers.avaliacao_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const avaliacao = await AvaliacaoCursoUtilizador.findByPk(id);

    if (!avaliacao) {
      return res.status(404).json({ success: false, message: "Avaliação não encontrada." });
    }

    await avaliacao.destroy();

    res.json({ success: true, message: "Avaliação apagada com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao apagar avaliação.", details: error.message, });
  }
};

module.exports = controllers;
