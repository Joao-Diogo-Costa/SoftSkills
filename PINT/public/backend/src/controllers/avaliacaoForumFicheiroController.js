const ForumFicheiro = require("../model/ForumFicheiro");
const AvaliacaoForumFicheiro = require("../model/AvaliacaoForumFicheiro");
const Utilizador = require("../model/Utilizador");
const { Sequelize } = require("sequelize");

const controllers = {};

// Listar avaliações
controllers.avaliacao_list = async (req, res) => {
  try {
    const avaliacoes = await AvaliacaoForumFicheiro.findAll({
      include: [ForumFicheiro, Utilizador],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: avaliacoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar avaliações.", details: error.message });
  }
};

// Média de avaliação do ficheiro do fórum
controllers.media_avaliacao_ficheiro = async (req, res) => {
  try {
    const forumFicheiroId = req.params.forumFicheiroId;
    const mediaArr = await AvaliacaoForumFicheiro.findAll({
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col('"NOTA"')), "mediaNota"],
        [Sequelize.fn("COUNT", Sequelize.col('"ID_AVALIACAO"')), "totalAvaliacoes"]
      ],
      where: { forumFicheiroId },
      include: [{ model: ForumFicheiro, attributes: ["nomeOriginal"] }],
      group: [
        '"AVALIACAO_FORUM_FICHEIRO"."ID_FORUM_FICHEIRO"',
        '"FORUM_FICHEIRO"."ID_FORUM_FICHEIRO"',
        '"FORUM_FICHEIRO"."NOME_ORIGINAL_FICHEIRO"'
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

// Detalhe de uma avaliação
controllers.avaliacao_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const avaliacao = await AvaliacaoForumFicheiro.findByPk(id, {
      include: [ForumFicheiro, Utilizador],
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
    const { nota, utilizadorId, forumFicheiroId, dataAvaliacao } = req.body;

    if (!nota || !utilizadorId || !forumFicheiroId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
    }

    if (nota < 1 || nota > 5) {
      return res.status(400).json({ success: false, message: "A nota deve estar entre 1 e 5." });
    }

    const ficheiro = await ForumFicheiro.findByPk(forumFicheiroId);
    const utilizador = await Utilizador.findByPk(utilizadorId);

    if (!ficheiro) {
      return res.status(404).json({ success: false, message: "ID de ficheiro inválido." });
    }

    if (!utilizador) {
      return res.status(404).json({ success: false, message: "ID de utilizador inválido." });
    }

    const avaliacaoExistente = await AvaliacaoForumFicheiro.findOne({
      where: {
        utilizadorId: utilizadorId,
        forumFicheiroId: forumFicheiroId,
      },
    });

    if (avaliacaoExistente) {
      return res.status(400).json({ success: false, message: "Já existe uma avaliação para este ficheiro. Use o endpoint de atualização." });
    }

    const novaAvaliacao = await AvaliacaoForumFicheiro.create({
      nota,
      forumFicheiroId,
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
    const { nota, forumFicheiroId, utilizadorId, dataAvaliacao } = req.body;

    const avaliacao = await AvaliacaoForumFicheiro.findByPk(id);
    if (!avaliacao) {
      return res.status(404).json({ success: false, message: "Avaliação não encontrada." });
    }

    if (nota && (nota < 1 || nota > 5)) {
      return res.status(400).json({ success: false, message: "A nota deve estar entre 1 e 5." });
    }

    if (forumFicheiroId) {
      const ficheiro = await ForumFicheiro.findByPk(forumFicheiroId);
      if (!ficheiro) {
        return res.status(400).json({ success: false, message: "ID de ficheiro inválido." });
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
      forumFicheiroId,
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
    const avaliacao = await AvaliacaoForumFicheiro.findByPk(id);

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
