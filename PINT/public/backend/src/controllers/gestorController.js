const Gestor = require("../model/Gestor");
const Curso = require("../model/Curso");
const CursoGestor = require("../model/CursoGestor");
const Utilizador = require("../model/Utilizador");

const controllers = {};

// Listar gestores com os cursos associados
controllers.gestor_list = async (req, res) => {
  try {
    const gestores = await Gestor.findAll({
      include: [Utilizador],
      order: [['id', 'ASC']],
    });
    res.json({ success: true, data: gestores });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar gestores.", details: error.message });
  }
};

// Detalhe de um gestor específico
controllers.gestor_detail = async (req, res) => {
    try {
        const id = req.params.id;
        const gestor = await Gestor.findByPk(id, {
            include: [Utilizador, { model: Curso, through: CursoGestor, as: "cursosGeridos" }],
        });

        if (!gestor) {
            return res.status(404).json({ success: false, message: "Gestor não encontrado." });
        }

        res.json({ success: true, data: gestor });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao obter gestor.", details: error.message });
    }
};

// Criar novo gestor
// Esta função para permitir a criação de gestores por outros gestores diretamente
controllers.gestor_create = async (req, res) => {
  try {
    const { utilizadorId } = req.body;

    if (!utilizadorId) {
      return res.status(400).json({ message: "ID de Utilizador é obrigatório." });
    }

    const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
    if (!utilizadorExiste) {
      return res.status(400).json({ message: "ID de Utilizador inválido." });
    }

    const gestorExistente = await Gestor.findOne({ where: { utilizadorId } });
    if (gestorExistente) {
      return res.status(409).json({ message: "Este utilizador já é um gestor." });
    }

    const novoGestor = await Gestor.create({
      utilizadorId,
    });

    res.status(201).json({ success: true, data: novoGestor });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar gestor.", details: error.message });
  }
};

// Atualizar gestor
controllers.gestor_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { utilizadorId } = req.body; // permite mudar o utilizador associado (com cuidado!)

    const gestor = await Gestor.findByPk(id);
    if (!gestor) {
      return res.status(404).json({ erro: "Gestor não encontrado." });
    }

    if (utilizadorId) {
      const utilizadorExiste = await Utilizador.findByPk(utilizadorId);
      if (!utilizadorExiste) {
        return res.status(400).json({ erro: "ID de Utilizador inválido." });
      }
      if (utilizadorId !== gestor.utilizadorId) {
        const gestorExistenteComNovoUtilizador = await Gestor.findOne({ where: { utilizadorId } });
        if (gestorExistenteComNovoUtilizador) {
          return res.status(409).json({ erro: "Já existe outro gestor com este ID de Utilizador." });
        }
      }
    }

    await gestor.update({
      utilizadorId: utilizadorId || gestor.utilizadorId,
      // Outros campos específicos do gestor, se houver
    });

    const gestorAtualizado = await Gestor.findByPk(id, { include: [Utilizador] });
    res.json({ success: true, data: gestorAtualizado });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar gestor.", details: error.message });
  }
};

// Apagar gestor
controllers.gestor_delete = async (req, res) => {
  try {
    const id = req.params.id;

    const gestor = await Gestor.findByPk(id);
    if (!gestor) {
      return res.status(404).json({ message: "Gestor não encontrado." });
    }

    await gestor.destroy();
    res.json({ success: true, message: "Gestor eliminado com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao eliminar gestor.", details: error.message });
  }
};

// Funções específicas do gestor (exemplos):

// Listar cursos gerenciados por um gestor
controllers.gestor_cursos = async (req, res) => {
  try {
    const gestorId = req.params.id;
    const gestor = await Gestor.findByPk(gestorId, {
      include: [{ model: Curso, through: CursoGestor, as: 'cursosGeridos' }],
    });

    if (!gestor) {
      return res.status(404).json({ message: "Gestor não encontrado." });
    }

    res.json({ success: true, data: gestor.cursosGeridos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar cursos do gestor.", details: error.message });
  }
};

// Adicionar um curso para um gestor gerenciar
controllers.gestor_adicionar_curso = async (req, res) => {
  try {
    const { gestorId, cursoId } = req.body;

    const gestor = await Gestor.findByPk(gestorId);
    const curso = await Curso.findByPk(cursoId);

    if (!gestor || !curso) {
      return res.status(404).json({ message: "Gestor ou curso não encontrado." });
    }

    await CursoGestor.create({ gestorId, cursoId });
    res.status(201).json({ success: true, message: "Curso adicionado ao gestor." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao adicionar curso ao gestor.", details: error.message });
  }
};

// Remover um curso da gestão de um gestor
controllers.gestor_remover_curso = async (req, res) => {
  try {
    const { gestorId, cursoId } = req.body;

    await CursoGestor.destroy({
      where: { gestorId, cursoId },
    });

    res.json({ success: true, message: "Curso removido do gestor." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao remover curso do gestor.", details: error.message });
  }
};

module.exports = controllers;
