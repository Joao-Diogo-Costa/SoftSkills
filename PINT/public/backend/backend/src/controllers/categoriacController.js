const CategoriaC = require("../model/CategoriaC");
const AreaC = require("../model/AreaC");

const controllers = {};

// Listar CategoriaC
controllers.categoria_list = async (req, res) => {
  try {
    const categoria = await CategoriaC.findAll({
      include: [AreaC],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: categoria });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao listar categorias.", error });
  }
};

// Detail CategoriaC
controllers.categoria_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const categoria = await CategoriaC.findByPk(id, {
      include: [AreaC],
    });

    if (categoria) {
      res.json({ success: true, data: categoria });
    } else {
      res
        .status(404)
        .json({ success: false, message: "Categoria não encontrada." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar categoria.", error });
  }
};

// Criar CategoriaC
controllers.categoria_create = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res.status(400).json({ erro: "Nome da categoria é obrigatório." });
    }

    const novaCategoria = await CategoriaC.create({ nome });

    res.status(201).json({ success: true, data: novaCategoria });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar categoria.",
      details: error.message,
    });
  }
};

// Atualizar CategoriaC
controllers.categoria_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { nome } = req.body;

    const categoria = await CategoriaC.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ erro: "Categoria não encontrada." });
    }

    await categoria.update({ nome });

    res.json({ success: true, data: categoria });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar categoria.", details: error.message });
  }
};

// Apagar CategoriaC
controllers.categoria_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const categoria = await CategoriaC.findByPk(id);

    if (!categoria) {
      return res.status(404).json({ error: "Categoria não encontrada." });
    }

    await categoria.destroy();

    res.json({ success: true, message: "Categoria apagada com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao apagar categoria.", details: error.message });
  }
};

module.exports = controllers;
