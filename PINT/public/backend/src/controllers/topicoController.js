const Topico = require("../model/Topico");
const Gestor = require("../model/Gestor");

const controllers = {};

// Listar todos os tópicos
controllers.topico_list = async (req, res) => {
  try {
    const topicos = await Topico.findAll({
      include: [Gestor],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: topicos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar tópicos.", error });
  }
};

// Detalhe de um tópico
controllers.topico_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const topico = await Topico.findByPk(id, {
      include: [Gestor],
    });

    if (topico) {
      res.json({ success: true, data: topico });
    } else {
      res.status(404).json({ success: false, message: "Tópico não encontrado." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar tópico.", error });
  }
};

// Criar novo tópico
controllers.topico_create = async (req, res) => {
  try {
    const { categoria, nome, criador, dataCriacao, gestorId } = req.body;

    if (!categoria || !nome || !criador || !dataCriacao || !gestorId) {
      return res.status(400).json({ erro: "Campos obrigatórios em falta." });
    }

    const gestor = await Gestor.findByPk(gestorId);
    if (!gestor) {
      return res.status(404).json({ erro: "Gestor não encontrado com esse ID." });
    }

    const novoTopico = await Topico.create({
      categoria,
      nome,
      criador,
      dataCriacao,
      gestorId,
    });

    res.status(201).json({ success: true, data: novoTopico });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar tópico.", error: error.message });
  }
};

// Atualizar tópico
controllers.topico_update = async (req, res) => {
  try {
    const { categoria, nome, criador, dataCriacao, gestorId } = req.body;
    const id = req.params.id;

    const topico = await Topico.findByPk(id);
    if (!topico) {
      return res.status(404).json({ erro: "Tópico não encontrado." });
    }

    if (gestorId) {
      const gestor = await Gestor.findByPk(gestorId);
      if (!gestor) {
        return res.status(404).json({ erro: "Gestor não encontrado com esse ID." });
      }
    }

    await topico.update({
      categoria,
      nome,
      criador,
      dataCriacao,
      gestorId,
    });

    res.json({ success: true, data: topico });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar tópico.", details: error.message });
  }
};

// Apagar tópico
controllers.topico_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const topico = await Topico.findByPk(id);
    if (!topico) {
      return res.status(404).json({ error: "Tópico não encontrado." });
    }

    await topico.destroy();

    res.json({ success: true, message: "Tópico removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover tópico.", details: error.message });
  }
};

module.exports = controllers;
