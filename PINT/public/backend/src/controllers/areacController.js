const AreaC = require("../model/AreaC");
const CategoriaC = require("../model/CategoriaC");

const controllers = {};

// Listar area
controllers.area_list = async (req, res) => {
  try {
    const area = await AreaC.findAll({
      include: [CategoriaC],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: area });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao listar áreas.", error });
  }
};

// Detail area
controllers.area_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const area = await AreaC.findByPk(id, {
      include: [CategoriaC],
    });

    if (area) {
      res.json({ success: true, data: area });
    } else {
      res.status(404).json({ success: false, message: "Área não encontrada." });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Erro ao buscar área.", error });
  }
};

// Criar area
controllers.area_create = async (req, res) => {
  try {
    const { nome, categoriaNome } = req.body;

    if (!nome || !categoriaNome) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const categoria = await CategoriaC.findOne({
      where: { nome: categoriaNome },
    });

    if (!categoria) {
      return res
        .status(404)
        .json({ erro: "Categoria não encontrada com esse nome." });
    }

    const novaArea = await AreaC.create({
      nome,
      categoriaId: categoria.id,
    });

    res.status(201).json({ success: true, data: novaArea });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar área.",
      details: error.message,
    });
  }
};

// Atualizar area
controllers.area_update = async (req, res) => {
  try {
    const { nome, categoriaNome } = req.body;
    const id = req.params.id;

    const area = await AreaC.findByPk(id);

    if (!area) {
      return res.status(404).json({ erro: "Área não encontrada." });
    }

    const categoria = await CategoriaC.findOne({
      where: { nome: categoriaNome },
    });

    if (!categoria) {
      return res
        .status(404)
        .json({ erro: "Categoria não encontrada com esse nome." });
    }

    await area.update({
      nome,
      categoriaId: categoria.id,
    });

    res.json({ success: true, data: area });
  } catch (error) {
    res
      .status(500)
      .json({ erro: "Erro ao atualizar área.", details: error.message });
  }
};

// Apagar area
controllers.area_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const area = await AreaC.findByPk(id);

    if (!area) {
      return res.status(404).json({ error: "Área não encontrada." });
    }

    await area.destroy();

    res.json({ success: true, message: "Área apagada com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao apagar a área.", details: error.message });
  }
};

module.exports = controllers;
