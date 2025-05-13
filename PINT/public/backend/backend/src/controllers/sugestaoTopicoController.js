const SugestaoTopico = require("../model/SugestaoTopico");
const Formando = require("../model/Formando");

const controllers = {};

// Listar sugestões
controllers.sugestao_list = async (req, res) => {
  try {
    const sugestoes = await SugestaoTopico.findAll({
      include: [Formando],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: sugestoes });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar sugestões.", error });
  }
};

// Detalhe da sugestão
controllers.sugestao_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const sugestao = await SugestaoTopico.findByPk(id, {
      include: [Formando],
    });

    if (sugestao) {
      res.json({ success: true, data: sugestao });
    } else {
      res.status(404).json({ success: false, message: "Sugestão não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar sugestão.", error });
  }
};

// Criar sugestão
controllers.sugestao_create = async (req, res) => {
  try {
    const { titulo, categoria, area, dataSugestao, estado, formandoId } = req.body;

    if (!titulo || !categoria || !area || !dataSugestao || !formandoId) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const formando = await Formando.findByPk(formandoId);
    if (!formando) {
      return res.status(404).json({ erro: "Formando não encontrado com esse ID." });
    }

    const novaSugestao = await SugestaoTopico.create({
      titulo,
      categoria,
      area,
      dataSugestao,
      estado,
      formandoId,
    });

    res.status(201).json({ success: true, data: novaSugestao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar sugestão.", error: error.message });
  }
};

// Atualizar sugestão
controllers.sugestao_update = async (req, res) => {
  try {
    const { titulo, categoria, area, dataSugestao, estado, formandoId } = req.body;
    const id = req.params.id;

    const sugestao = await SugestaoTopico.findByPk(id);
    if (!sugestao) {
      return res.status(404).json({ erro: "Sugestão não encontrada." });
    }

    if (formandoId) {
      const formando = await Formando.findByPk(formandoId);
      if (!formando) {
        return res.status(404).json({ erro: "Formando não encontrado com esse ID." });
      }
    }

    await sugestao.update({
      titulo,
      categoria,
      area,
      dataSugestao,
      estado,
      formandoId,
    });

    res.json({ success: true, data: sugestao });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar sugestão.", details: error.message });
  }
};

// Apagar sugestão
controllers.sugestao_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const sugestao = await SugestaoTopico.findByPk(id);
    if (!sugestao) {
      return res.status(404).json({ error: "Sugestão não encontrada." });
    }

    await sugestao.destroy();

    res.json({ success: true, message: "Sugestão apagada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao apagar sugestão.", details: error.message });
  }
};

module.exports = controllers;