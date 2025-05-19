const AreaC = require("../model/AreaC");
const CategoriaC = require("../model/CategoriaC");

const controllers = {};

// Listar area
controllers.area_list = async (req, res) => {
  try {
    console.log("Entrou em area_list");
    const area = await AreaC.findAll({
      include: [CategoriaC],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: area });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar áreas.", details: error.message });
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
    res.status(500).json({ success: false, message: "Erro ao buscar área.", details: error.message });
  }
};

// Criar area
controllers.area_create = async (req, res) => {
  try {
    const { nome, categoriaId } = req.body;

    if (!nome || !categoriaId) {
      return res.status(400).json({ message: "Campos obrigatórios em falta." });
    }

    const categoriaExiste = await CategoriaC.findByPk(categoriaId);
    if (!categoriaExiste) {
      return res.status(404).json({ message: "Categoria não encontrada com esse ID." });
    }

    const novaArea = await AreaC.create({
      nome,
      categoriaId,
    });

    res.status(201).json({ success: true, data: novaArea });
  } catch (error) {
    console.error("Erro ao criar área:", error);
    res.status(500).json({success: false, message: "Erro ao criar área.", details: error.message});
  }
};

// Atualizar area
controllers.area_update = async (req, res) => {
  try {
    const { nome, categoriaId } = req.body;
    const id = req.params.id;

    const area = await AreaC.findByPk(id);

    if (!area) {
      return res.status(404).json({ message: "Área não encontrada." });
    }

    const categoriaExiste = await CategoriaC.findByPk(categoriaId);
    if (!categoriaExiste) {
      return res.status(404).json({ message: "Categoria não encontrada com esse ID." });
    }

    await area.update({
      nome,
      categoriaId,
    });

    res.json({ success: true, data: area });
  } catch (error) {
    console.error("Erro ao atualizar área:", error);
    res.status(500).json({ message: "Erro ao atualizar área.", details: error.message });
  }
};

// Apagar area
controllers.area_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const area = await AreaC.findByPk(id);

    if (!area) {
      return res.status(404).json({ message: "Área não encontrada." });
    }

    await area.destroy();

    res.json({ success: true, message: "Área apagada com sucesso." });
  } catch (error) {
    res.status(500).json({ message: "Erro ao apagar a área.", details: error.message });
  }
};

module.exports = controllers;
