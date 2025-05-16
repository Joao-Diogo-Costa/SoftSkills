const Conteudo = require("../model/Conteudo");
const Curso = require("../model/Curso");

const controllers = {};

// Listar todos os conteúdos
controllers.conteudo_list = async (req, res) => {
  try {
    const conteudos = await Conteudo.findAll({
      include: [Curso],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: conteudos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar conteúdos.", details: error.message });
  }
};

// Detalhar conteúdo por ID
controllers.conteudo_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const conteudo = await Conteudo.findByPk(id, {
      include: [Curso],
    });

    if (!conteudo) {
      return res.status(404).json({ success: false, message: "Conteúdo não encontrado." });
    }

    res.json({ success: true, data: conteudo });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar conteúdo.", details: error.message });
  }
};

// Criar novo conteúdo
controllers.conteudo_create = async (req, res) => {
  try {
    const { titulo, descricao, cursoId } = req.body;

    if (!cursoId) {
      return res.status(400).json({ message: "ID do curso é obrigatório." });
    }

    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(404).json({ message: "Curso não encontrado." });
    }

    const novoConteudo = await Conteudo.create({
      titulo,
      descricao,
      cursoId,
    });

    res.status(201).json({ success: true, data: novoConteudo });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar conteúdo.", details: error.message });
  }
};

// Atualizar conteúdo existente
controllers.conteudo_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { titulo, descricao, cursoId } = req.body;

    const conteudo = await Conteudo.findByPk(id);
    if (!conteudo) {
      return res.status(404).json({ message: "Conteúdo não encontrado." });
    }

    if (cursoId) {
      const curso = await Curso.findByPk(cursoId);
      if (!curso) {
        return res.status(404).json({ message: "Curso não encontrado." });
      }
    }

    await conteudo.update({ titulo, descricao, cursoId });
    res.json({ success: true, data: conteudo });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar conteúdo.", details: error.message });
  }
};

// Apagar conteúdo
controllers.conteudo_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const conteudo = await Conteudo.findByPk(id);
    if (!conteudo) {
      return res.status(404).json({ error: "Conteúdo não encontrado." });
    }

    await conteudo.destroy();
    res.json({ success: true, message: "Conteúdo removido com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao apagar conteúdo.", details: error.message });
  }
};

module.exports = controllers;
