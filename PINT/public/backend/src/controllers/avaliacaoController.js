const Avaliacao = require("../model/Avaliacao");
const Formador = require("../model/Formador");
const Formando = require("../model/Formando");
const Curso = require("../model/Curso");
const AvaliacaoCurso = require("../model/AvaliacaoCurso");

const controllers = {};

// Listar avaliações
controllers.Avaliacao_list = async (req, res) => {
  try {
    const avaliacao = await Avaliacao.findAll({
      include: [
        Formador,
        Formando,
        {
          model: Curso,
          through: AvaliacaoCurso,
        },
      ],
      order: [["dataAvaliacao", "ASC"]],
    });

    res.json({ success: true, data: avaliacao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar avaliações.", error });
  }
};

// Detail avaliação
controllers.Avaliacao_detail = async (req, res) => {
  try {
    const id = req.params.id;

    const avaliacao = await Avaliacao.findByPk(id, {
      include: [Formador, Formando, { model: Curso, through: AvaliacaoCurso }],
    });

    if (avaliacao) {
      res.json({ success: true, data: avaliacao });
    } else {
      res.status(404).json({ success: false, message: "Avaliação não encontrada." });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao encontrar avaliação.", error });
  }
};

// Criar avaliação
controllers.Avaliacao_create = async (req, res) => {
  try {
    const { nota, dataLimite, dataAvaliacao, formadorId, formandoId, cursoId } =
      req.body;

    if (!nota || !dataLimite || !formadorId || !formandoId || !cursoId) {
      return res.status(400).json({ message: "Campos obrigatórios em falta." });
    }

    // Verificar se o formador e formando existem
    const formador = await Formador.findByPk(formadorId);
    const formando = await Formando.findByPk(formandoId);

    if (!formador) {
      return res.status(404).json({ message: "Formador não encontrado." });
    }

    if (!formando) {
      return res.status(404).json({ message: "Formando não encontrado." });
    }

    const novaAvaliacao = await Avaliacao.create({
      nota,
      dataLimite,
      dataAvaliacao,
      formadorId,
      formandoId,
    });

    if (cursoId && cursoId.length > 0) {
      const avaliacaoCursos = cursoId.map((cursoId) => ({
        avaliacaoId: novaAvaliacao.id,
        cursoId,
      }));

      await AvaliacaoCurso.bulkCreate(avaliacaoCursos);
    }

    res.status(201).json({ success: true, data: novaAvaliacao });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar avaliação.", details: error.message });
  }
};

// Atualizar avaliação
controllers.Avaliacao_update = async (req, res) => {
  try {
    const { dataLimite, dataAvaliacao, formadorId, formandoId, cursoId } =
      req.body;
    const avaliacao = await Avaliacao.findByPk(req.params.id);

    if (!avaliacao) {
      return res.status(404).json({ message: "Avaliação não encontrada." });
    }

    // Verificar se o formador e formando existem
    const formador = await Formador.findByPk(formadorId);
    const formando = await Formando.findByPk(formandoId);

    if (!formador) {
      return res.status(404).json({ message: "Formador não encontrado." });
    }

    if (!formando) {
      return res.status(404).json({ message: "Formando não encontrado." });
    }

    // Atualizar a avaliação
    await avaliacao.update({
      nota,
      dataLimite,
      dataAvaliacao,
      formadorId,
      formandoId,
    });

    // Atualizar cursos associados à avaliação
    if (cursoId && cursoId.length > 0) {
      await AvaliacaoCurso.destroy({ where: { avaliacaoId: avaliacao.id } });

      const avaliacaoCursos = cursoId.map((cursoId) => ({
        avaliacaoId: avaliacao.id,
        cursoId,
      }));

      await AvaliacaoCurso.bulkCreate(avaliacaoCursos);
    }

    res.json({ success: true, data: avaliacao });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar avaliação.", details: error.message });
  }
};

// Apagar avaliação
controllers.Avaliacao_delete = async (req, res) => {
  try {
    const { id } = req.params;

    const avaliacao = await Avaliacao.findByPk(id);

    if (!avaliacao) {
      return res.status(404).json({ message: "Avaliação não encontrada." });
    }

    await avaliacao.destroy();
    res.json({ success: true, message: "Avaliação apagada com sucesso." });
  } catch (error) {
    res.status(500).json({message: "Erro ao apagar avaliação.", details: error.message });
  }
};

module.exports = controllers;
