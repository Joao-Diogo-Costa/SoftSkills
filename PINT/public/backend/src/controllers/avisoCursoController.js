const AvisoCurso = require("../model/AvisoCurso");
const Curso = require("../model/Curso");
const Utilizador = require("../model/Utilizador");
const Inscricao = require("../model/Inscricao")
const Notificacao = require("../model/Notificacao")

const controllers = {};

// Listar todos os avisos
controllers.aviso_list = async (req, res) => {
  try {
    const avisos = await AvisoCurso.findAll({
      include: [Curso, Utilizador],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: avisos });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao listar avisos.", details: error.message, });
  }
};

// Detalhar aviso
controllers.aviso_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const aviso = await AvisoCurso.findByPk(id, {
      include: [Curso, Utilizador],
    });

    if (!aviso) {
      return res.status(404).json({ success: false, message: "Aviso não encontrado." });
    }

    res.json({ success: true, data: aviso });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao buscar aviso.", details: error.message,});
  }
};

// Criar aviso
controllers.aviso_create = async (req, res) => {
  try {
    const { descricao, titulo, cursoId, utilizadorId, dataPublicacao } = req.body;

    if (!descricao || !titulo || !cursoId || !utilizadorId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
    }

    const curso = await Curso.findByPk(cursoId);
    const utilizador = await Utilizador.findByPk(utilizadorId);

    if (!curso) {
      return res.status(400).json({ success: false, message: "ID de curso inválido." });
    }

    if (!utilizador) {
      return res.status(400).json({ success: false, message: "ID de utilizador inválido." });
    }

    const novoAviso = await AvisoCurso.create({
      descricao,
      titulo,
      cursoId,
      utilizadorId,
      dataPublicacao: dataPublicacao || new Date(),
    });

    const inscricoesDoCurso = await Inscricao.findAll({
      where: { cursoId: cursoId },
      attributes: ['utilizadorId']
    });

    const notificacoesCriadas = [];
    for (const inscricao of inscricoesDoCurso) {
      const notificacao = await Notificacao.create({
        utilizadorId: inscricao.utilizadorId,
        titulo: `Novo Aviso no Curso: ${curso.nome} - ${titulo}`,
        mensagem: `Um novo aviso foi publicado: "${descricao.substring(0, 100)}..."`,
        dataEnvio: new Date(),
        lida: false,
        cursoId: cursoId,
      });
      notificacoesCriadas.push(notificacao);
    }


    res.status(201).json({ success: true, data: novoAviso });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao criar aviso.",details: error.message, });
  }
};

// Atualizar aviso
controllers.aviso_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { descricao, titulo, cursoId, utilizadorId, dataPublicacao } = req.body;

    if (!descricao || !titulo || !cursoId || !utilizadorId) {
      return res.status(400).json({ success: false, message: "Campos obrigatórios ausentes." });
    }

    const aviso = await AvisoCurso.findByPk(id);
    if (!aviso) {
      return res.status(404).json({ success: false, message: "Aviso não encontrado." });
    }

    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res.status(400).json({ success: false, message: "ID de curso inválido." });
    }
    
    const utilizador = await Utilizador.findByPk(utilizadorId);
    if (!utilizador) {
      return res.status(400).json({ success: false, message: "ID de utilizador inválido." });
    }

    await aviso.update({
      descricao,
      titulo,
      cursoId,
      utilizadorId,
      dataPublicacao: dataPublicacao || new Date(),
    });

    res.json({ success: true, data: aviso });
  } catch (error) {
    res.status(500).json({success: false, message: "Erro ao atualizar aviso.", details: error.message,});
  }
};

// Apagar aviso
controllers.aviso_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const aviso = await AvisoCurso.findByPk(id);

    if (!aviso) {
      return res.status(404).json({ success: false, message: "Aviso não encontrado." });
    }

    await aviso.destroy();

    res.json({ success: true, message: "Aviso apagado com sucesso." });
  } catch (error) {
    res.status(500).json({success: false,message: "Erro ao apagar aviso.",details: error.message,});
  }
};

module.exports = controllers;
