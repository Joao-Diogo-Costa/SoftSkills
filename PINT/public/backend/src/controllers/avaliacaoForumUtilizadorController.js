const Forum = require("../model/Forum");
const AvaliacaoForumUtilizador = require("../model/AvaliacaoForumUtilizador");
const Utilizador = require("../model/Utilizador");
const { Sequelize } = require("sequelize");

const controllers = {};

// Listar avaliações
controllers.avaliacao_list = async (req, res) => {
  try {
    const avaliacoes = await AvaliacaoForumUtilizador.findAll({
      include: [Forum, Utilizador],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: avaliacoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar avaliações.", details: error.message });
  }
};

// Média de avaliação do fórum
controllers.media_avaliacao_forum = async (req, res) => {
  try {
    const forumId = req.params.forumId;
    const mediaArr = await AvaliacaoForumUtilizador.findAll({
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col('"NOTA"')), "mediaNota"],
        [Sequelize.fn("COUNT", Sequelize.col('"ID_AVALIACAO"')), "totalAvaliacoes"]
      ],
      where: { forumId },
      include: [{ model: Forum, attributes: ["nome"] }],
      group: [
        '"AVALIACAO_FORUM_UTILIZADOR"."ID_FORUM"',
        '"FORUM"."ID_FORUM"',
        '"FORUM"."NOME_FORUM"'
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
    const avaliacao = await AvaliacaoForumUtilizador.findByPk(id, {
      include: [Forum, Utilizador],
    });

    if (!avaliacao) {
      return res.status(404).json({ success: false, message: "Avaliação não encontrada." });
    }

    res.json({ success: true, data: avaliacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar avaliação.", details: error.message });
  }
};

// Criar avaliação
controllers.avaliacao_create = async (req, res) => {
  try {
    const { nota, utilizadorId, forumId, dataAvaliacao } = req.body;

    if (!nota || !utilizadorId || !forumId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ success: false, message: "A nota deve estar entre 1 e 5." });
    }

    const forum = await Forum.findByPk(forumId);
    const utilizador = await Utilizador.findByPk(utilizadorId);

    if (!forum) {
      return res.status(404).json({ success: false, message: "ID de fórum inválido." });
    }

    if (!utilizador) {
      return res.status(404).json({ success: false, message: "ID de utilizador inválido." });
    }

    const avaliacaoExistente = await AvaliacaoForumUtilizador.findOne({
      where: {
        utilizadorId: utilizadorId,
        forumId: forumId,
      },
    });

    if (avaliacaoExistente) {
      return res.status(400).json({ success: false, message: "Já existe uma avaliação para este fórum. Use o endpoint de atualização." });
    }

    const novaAvaliacao = await AvaliacaoForumUtilizador.create({
      nota,
      forumId,
      utilizadorId,
      dataAvaliacao: dataAvaliacao || new Date(),
    });

    res.status(201).json({ success: true, data: novaAvaliacao });
  } catch (error) {
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
    const { nota, forumId, utilizadorId, dataAvaliacao } = req.body;

    const avaliacao = await AvaliacaoForumUtilizador.findByPk(id);
    if (!avaliacao) {
      return res.status(404).json({ success: false, message: "Avaliação não encontrada." });
    }

    if (nota && (nota < 1 || nota > 5)) {
      return res.status(400).json({ success: false, message: "A nota deve estar entre 1 e 5." });
    }

    if (forumId) {
      const forum = await Forum.findByPk(forumId);
      if (!forum) {
        return res.status(400).json({ success: false, message: "ID de fórum inválido." });
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
      forumId,
      utilizadorId,
      dataAvaliacao,
    });

    res.json({ success: true, data: avaliacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar avaliação.", details: error.message });
  }
};

// Apagar avaliação
controllers.avaliacao_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const avaliacao = await AvaliacaoForumUtilizador.findByPk(id);

    if (!avaliacao) {
      return res.status(404).json({ success: false, message: "Avaliação não encontrada." });
    }

    await avaliacao.destroy();

    res.json({ success: true, message: "Avaliação apagada com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao apagar avaliação.", details: error.message });
  }
};

module.exports = controllers;