const Denuncia = require("../model/Denuncia");
const Comentario = require("../model/Comentario");
const Utilizador = require("../model/Utilizador");
const { Op, fn, col } = require("sequelize");

const controllers = {};

// Listar todas as denúncias
controllers.denuncia_list = async (req, res) => {
  try {
    const denuncias = await Denuncia.findAll({
      include: [
        { model: Utilizador, as: "Utilizador" },
        {
          model: Comentario,
          as: "Comentario",
          include: [{ model: Utilizador, as: "Utilizador" }]
        }
      ],
      order: [["dataDenuncia", "DESC"]],
    });
    res.json({ success: true, data: denuncias });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar denúncias.", details: error.message, });
  }
};

controllers.utilizador_mais_denunciado = async (req, res) => {
  try {
    const result = await Denuncia.findAll({
      attributes: [
        [fn("COUNT", col("Comentario.ID_UTILIZADOR")), "totalDenuncias"],
        [col("Comentario.ID_UTILIZADOR"), "utilizadorDenunciadoId"]
      ],
      include: [
        {
          model: Comentario,
          as: "Comentario",
          attributes: [],
        }
      ],
      group: ["Comentario.ID_UTILIZADOR"],
      order: [[fn("COUNT", col("Comentario.ID_UTILIZADOR")), "DESC"]],
      raw: true,
      limit: 1
    });

    if (result.length === 0) {
      return res.json({ success: true, data: null });
    }

    const utilizador = await Utilizador.findByPk(result[0].utilizadorDenunciadoId);

    res.json({
      success: true,
      data: {
        utilizador,
        totalDenuncias: result[0].totalDenuncias
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar utilizador mais denunciado.", details: error.message });
  }
};

// Detail denuncia
controllers.denuncia_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const denuncia = await Denuncia.findByPk(id, {
      include: [Comentario, Utilizador],
    });
    if (!denuncia) {
      return res.status(404).json({ success: false, message: "Denúncia não encontrada." });
    }
    res.json({ success: true, data: denuncia });
  } catch (error) {
    res.status(500).json({  success: false, message: "Erro ao buscar denúncia.", details: error.message, });
  }
};

// Criar nova denúncia
controllers.denuncia_create = async (req, res) => {
  try {
    const { descricao, utilizadorId, comentarioId } = req.body;

    if (!descricao || !utilizadorId || !comentarioId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios faltando." });
    }

    const utilizador = await Utilizador.findByPk(utilizadorId);
    if (!utilizador) {
      return res.status(400).json({ success: false, message: "Utilizador inválido." });
    }

    const comentario = await Comentario.findByPk(comentarioId);
    if (!comentario) {
      return res.status(400).json({ success: false, message: "Comentário inválido." });
    }

    const novaDenuncia = await Denuncia.create({
      descricao,
      utilizadorId,
      comentarioId,
    });

    res.status(201).json({ success: true, data: novaDenuncia });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar denúncia.", details: error.message, });
  }
};

// Atualizar denúncia existente
controllers.denuncia_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { descricao, utilizadorId, comentarioId } = req.body;

    const denuncia = await Denuncia.findByPk(id);
    if (!denuncia) {
      return res.status(404).json({ success: false, message: "Denúncia não encontrada." });
    }

    if (utilizadorId) {
      const utilizador = await Utilizador.findByPk(utilizadorId);
      if (!utilizador) {
        return res.status(400).json({ success: false, message: "Utilizador inválido." });
      }
    }

    if (comentarioId) {
      const comentario = await Comentario.findByPk(comentarioId);
      if (!comentario) {
        return res.status(400).json({ success: false, message: "Comentário inválido." });
      }
    }

    await denuncia.update({
      descricao,
      utilizadorId,
      comentarioId,
    });

    res.json({ success: true, data: denuncia });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao atualizar denúncia.", details: error.message, });
  }
};


// Apagar denúncia
controllers.denuncia_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const denuncia = await Denuncia.findByPk(id);

    if (!denuncia) {
      return res.status(404).json({ success: false, message: "Denúncia não encontrada." });
    }

    await denuncia.destroy();

    res.json({ success: true, message: "Denúncia removida com sucesso." });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao remover denúncia.", details: error.message,});
  }
};

module.exports = controllers;
