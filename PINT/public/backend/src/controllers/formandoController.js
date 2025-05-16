const Formando = require("../model/Formando");
const Gestor = require("../model/Gestor");
const Utilizador = require("../model/Utilizador");


const controllers = {};

// Listar formando
controllers.formando_list = async (req, res) => {
  try {
    const formandos = await Formando.findAll({
      include: [Utilizador, Gestor],
      order: [['id', 'ASC']],
    });
    res.json({ success: true, data: formandos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar formandos.", details: error.message });
  }
};

// Detail formando
controllers.formando_detail = async (req, res) => {
try {
    const id = req.params.id;
    const formando = await Formando.findByPk(id, {
      include: [Utilizador, Gestor],
    });

    if (!formando) {
      return res.status(404).json({ success: false, message: "Formando não encontrado." });
    }

    res.json({ success: true, data: formando });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter formando.", details: error.message });
  }
};

// Criar formando
controllers.formando_create = async (req, res) => {
  try {
    const { outrasInf, pontos, utilizadorId, gestorId } = req.body;

    if (!utilizadorId || !gestorId) {
      return res.status(400).json({ message: "ID de Utilizador e Gestor são obrigatórios." });
    }

    const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
    const gestorExiste = await Gestor.findByPk(gestorId);

    if (!utilizadorExiste) {
      return res.status(400).json({ message: "ID de Utilizador inválido." });
    }
    if (!gestorExiste) {
      return res.status(400).json({ message: "ID de Gestor inválido." });
    }

    const formandoExistente = await Formando.findOne({ where: { utilizadorId } });
    if (formandoExistente) {
      return res.status(409).json({ message: "Este utilizador já está registado como formando." });
    }

    const novoFormando = await Formando.create({
      outrasInf,
      pontos,
      utilizadorId,
      gestorId,
    });

    res.status(201).json({ success: true, data: novoFormando });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar formando.", details: error.message });
  }
};

// Atualizar formando
controllers.formando_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { outrasInf, pontos, utilizadorId, gestorId } = req.body;

    const formando = await Formando.findByPk(id);
    if (!formando) {
      return res.status(404).json({ message: "Formando não encontrado." });
    }

    if (utilizadorId) {
      const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
      if (!utilizadorExiste) {
        return res.status(400).json({ message: "ID de Utilizador inválido." });
      }
      if (utilizadorId !== formando.utilizadorId) { // Se o utilizadorId está sendo alterado
        const formandoExistenteComNovoUtilizador = await Formando.findOne({ where: { utilizadorId } });
        if (formandoExistenteComNovoUtilizador) {
          return res.status(409).json({ message: "Já existe outro formando com este ID de Utilizador." });
        }
      }
    }

    if (gestorId) {
      const gestorExiste = await Gestor.findByPk(gestorId);
      if (!gestorExiste) {
        return res.status(400).json({ message: "ID de Gestor inválido." });
      }
    }

    await formando.update({
      outrasInf,
      pontos,
      utilizadorId,
      gestorId,
    });

    res.json({ success: true, data: formando });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar formando.", details: error.message });
  }
};

// Delete formando
controllers.formando_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const formando = await Formando.findByPk(id);
    if (!formando) {
      return res.status(404).json({ message: "Formando não encontrado." });
    }

    await formando.destroy();
    res.json({ success: true, message: "Formando eliminado com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao eliminar formando.", details: error.message });
  }
};

module.exports = controllers;