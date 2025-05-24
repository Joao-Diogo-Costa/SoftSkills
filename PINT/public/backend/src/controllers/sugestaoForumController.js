const SugestaoForum = require("../model/SugestaoForum");
const Utilizador = require("../model/Utilizador");
const TopicoC = require("../model/TopicoC");

const controllers = {};

// Listar sugestões
controllers.sugestao_list = async (req, res) => {
  try {
    const sugestoes = await SugestaoForum.findAll({
      include: [Utilizador, TopicoC],
      order: [["dataSugestao", "DESC"]],
    });
    res.json({ success: true, data: sugestoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar sugestões.", details: error.message,});
  }
};

// Detalhe da sugestão
controllers.sugestao_detail = async (req, res) => {
  try {
    const sugestao = await SugestaoForum.findByPk(req.params.id, {
      include: [Utilizador, TopicoC],
    });

    if (!sugestao) {
      return res.status(404).json({ success: false, message: "Sugestão não encontrada." });
    }

    res.json({ success: true, data: sugestao });
  } catch (error) {
    res.status(500).json({ success: false,message: "Erro ao buscar sugestão.", details: error.message,});
  }
};

// Criar sugestão
controllers.sugestao_create = async (req, res) => {
  try {
    const { titulo, dataSugestao, estado, utilizadorId, topicoId } = req.body;

    if (!titulo || !dataSugestao || !utilizadorId || !topicoId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios em falta." });
    }

     const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
    if (!utilizadorExiste) {
      return res
        .status(400)
        .json({ success: false, message: "ID de utilizador inválido." });
    }

    const topicoExiste = await TopicoC.findByPk(topicoId);
    if (!topicoExiste) {
      return res.status(400).json({ success: false, message: "ID de tópico inválido." });
    }

    const novaSugestao = await SugestaoForum.create({
      titulo,
      dataSugestao,
      estado: estado ?? 0,
      utilizadorId,
      topicoId,
    });

    res.status(201).json({ success: true, data: novaSugestao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar sugestão.",details: error.message,});
  }
};

// Atualizar sugestão
controllers.sugestao_update = async (req, res) => {
  try {
    const { titulo, dataSugestao, estado, utilizadorId, topicoId } = req.body;
    const sugestao = await SugestaoForum.findByPk(req.params.id);

    if (!sugestao) {
      return res.status(404).json({ success: false, message: "Sugestão não encontrada." });
    }

        if (utilizadorId) {
      const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
      if (!utilizadorExiste) {
        return res.status(400).json({ success: false, message: "ID de utilizador inválido." });
      }
    }

    if (topicoId) {
      const topicoExiste = await TopicoC.findByPk(topicoId);
      if (!topicoExiste) {
        return res.status(400).json({ success: false, message: "ID de tópico inválido." });
      }
    }

    await sugestao.update({
      titulo: titulo ?? sugestao.titulo,
      dataSugestao: dataSugestao ?? sugestao.dataSugestao,
      estado: estado ?? sugestao.estado,
      utilizadorId: utilizadorId ?? sugestao.utilizadorId,
      topicoId: topicoId ?? sugestao.topicoId,
    });

    res.json({ success: true, data: sugestao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar sugestão.",details: error.message,});
  }
};

// Apagar sugestão
controllers.sugestao_delete = async (req, res) => {
  try {
    const sugestao = await SugestaoForum.findByPk(req.params.id);

    if (!sugestao) {
      return res.status(404).json({ success: false, message: "Sugestão não encontrada." });
    }

    await sugestao.destroy();
    res.json({ success: true, message: "Sugestão eliminada com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao eliminar sugestão.",details: error.message,});
  }
};

module.exports = controllers;