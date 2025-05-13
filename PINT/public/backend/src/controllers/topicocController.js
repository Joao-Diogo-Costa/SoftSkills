const TopicoC = require("../model/TopicoC");
const AreaC = require("../model/AreaC");

const controllers = {};

// Listar TopicoC
controllers.topico_list = async (req, res) => {
  try {
    const topico = await TopicoC.findAll({
      include: [AreaC],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: topico });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao listar tópicos.", error });
  }
};

// Detail TopicoC
controllers.topico_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const topico = await TopicoC.findByPk(id, {
      include: [AreaC],
    });

    if (topico) {
      res.json({ success: true, data: topico });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Tópico não encontrado." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar tópico.", error });
  }
};

// Criar TopicoC
controllers.topico_create = async (req, res) => {
  try {
    const { nomeTopico, areaNome } = req.body;

    if (!nomeTopico || !areaNome) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const area = await AreaC.findOne({ where: { nome: areaNome } });

    if (!area) {
      return res
        .status(404)
        .json({ erro: "Área não encontrada com esse nome." });
    }

    const novoTopico = await TopicoC.create({
      nomeTopico,
      areaId: area.id,
    });

    res.status(201).json({ success: true, data: novoTopico });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erro ao criar tópico.",
        details: error.message,
      });
  }
};

// Atualizar TopicoC
controllers.topico_update = async (req, res) => {
  try {
    const { nomeTopico, areaNome } = req.body;
    const id = req.params.id;

    const topico = await TopicoC.findByPk(id);

    if (!topico) {
      return res.status(404).json({ erro: "Tópico não encontrado." });
    }

    const area = await AreaC.findOne({ where: { nome: areaNome } });

    if (!area) {
      return res
        .status(404)
        .json({ erro: "Área não encontrada com esse nome." });
    }

    await topico.update({
      nomeTopico,
      areaId: area.id,
    });

    res.json({ success: true, data: topico });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar tópico.", details: error.message });
  }
};

// Apagar TopicoC
controllers.topico_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const topico = await TopicoC.findByPk(id);

    if (!topico) {
      return res.status(404).json({ error: "Tópico não encontrado." });
    }

    await topico.destroy();

    res.json({ success: true, message: "Tópico apagado com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao apagar o tópico.", details: error.message });
  }
};

module.exports = controllers;
