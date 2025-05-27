const TopicoC = require("../model/TopicoC");
const AreaC = require("../model/AreaC");


const controllers = {};

// Listar TopicoC
controllers.topicoc_list = async (req, res) => {
  try {
    const topicos = await TopicoC.findAll({
      include: [AreaC],
      order: [["nomeTopico", "ASC"]],
    });
    res.json({ success: true, data: topicos });
  } catch (error) {
    res.status(500).json({ success: false,message: "Erro ao listar tópicos.",details: error.message,});
  }
};

// Detail TopicoC
controllers.topicoc_detail = async (req, res) => {
  try {
    const topico = await TopicoC.findByPk(req.params.id, {
      include: [AreaC],
    });

    if (!topico) {
      return res.status(404).json({ success: false, message: "Tópico não encontrado." });
    }

    res.json({ success: true, data: topico });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao buscar tópico.",details: error.message,});
  }
}

// Criar TopicoC
controllers.topicoc_create = async (req, res) => {
  try {
    const { nomeTopico, areaId } = req.body;

    if (!nomeTopico || !areaId) {
      return res.status(400).json({
        success: false,
        message: "Campos obrigatórios estão em falta.",
      });
    }

    const novoTopico = await TopicoC.create({ nomeTopico, areaId });

    res.status(201).json({ success: true, data: novoTopico });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar tópico.", details: error.message,});
  }
};

// Atualizar TopicoC
controllers.topicoc_update = async (req, res) => {
  try {
    const topico = await TopicoC.findByPk(req.params.id);

    if (!topico) {
      return res.status(404).json({ success: false, message: "Tópico não encontrado." });
    }

    const { nomeTopico, areaId } = req.body;

    await topico.update({
      nomeTopico: nomeTopico ?? topico.nomeTopico,
      areaId: areaId ?? topico.areaId,
    });

    res.json({ success: true, data: topico });
  } catch (error) {
    res.status(500).json({ success: false,message: "Erro ao atualizar tópico.",details: error.message,});
  }
};

// Apagar TopicoC
controllers.topicoc_delete = async (req, res) => {
  try {
    const topico = await TopicoC.findByPk(req.params.id);

    if (!topico) {
      return res.status(404).json({ success: false, message: "Tópico não encontrado." });
    }

    await topico.destroy();
    res.json({ success: true, message: "Tópico eliminado com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao eliminar tópico.", details: error.message,});
  }
};


module.exports = controllers;
