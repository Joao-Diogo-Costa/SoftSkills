const Curso = require("../model/Curso");
const CategoriaC = require("../model/CategoriaC");
const AreaC = require("../model/AreaC");
const TopicoC = require("../model/TopicoC");
const Inscricao = require("../model/Inscricao");
const Conteudo = require("../model/Conteudo");
const ConteudoFicheiro = require("../model/ConteudoFicheiro");
const AvisoCurso = require("../model/AvisoCurso");
const Tarefa = require("../model/Tarefa");
const TarefaFicheiro = require("../model/TarefaFicheiro");
const AulaAssincrona = require("../model/AulaAssincrona");
const AulaSincrona = require("../model/AulaSincrona");
const Utilizador = require("../model/Utilizador"); 
const SubmissaoTarefa = require("../model/SubmissaoTarefa");
const sequelize = require("../model/database");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();
const multer = require("multer");

const { Op, fn, col } = require("sequelize");

const {
  s3,
  PutObjectCommand,
  DeleteObjectCommand,
  getKeyFromS3Url,
} = require("../config/s3Config");
const path = require("path");

const controllers = {};

// Listar cursos
controllers.curso_list = async (req, res) => {
  try {
    const cursos = await Curso.findAll({
      include: TopicoC,
      order: [["dataUpload", "DESC"]],
    });
    res.json({ success: true, data: cursos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar cursos.",
      details: error.message,
    });
  }
};

controllers.listarCursosPorCategoria = async (req, res) => {
  try {
    const { idCategoria } = req.params;

    const cursos = await Curso.findAll({
      include: [
        {
          model: TopicoC,
          include: [
            {
              model: AreaC,
              include: [
                {
                  model: CategoriaC,
                  where: { id: idCategoria },
                },
              ],
            },
          ],
        },
      ],
    });

    res.json({ success: true, data: cursos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao encontrar cursos por categoria.",
      details: error.message,
    });
  }
};

controllers.listarCursosPorArea = async (req, res) => {
  try {
    const { idArea } = req.params;

    const cursos = await Curso.findAll({
      include: [
        {
          model: TopicoC,
          include: [
            {
              model: AreaC,
              where: { id: idArea },
            },
          ],
        },
      ],
    });

    res.json({ success: true, data: cursos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao encontrar cursos por área.",
      details: error.message,
    });
  }
};

controllers.listarCursosPorFormador = async (req, res) => {
  try {
    const formadorId = req.utilizador.id;

    const cursos = await Curso.findAll({
      where: { formadorId },
      include: [
        {
          model: TopicoC,
          include: [
            {
              model: AreaC,
              include: [
                {
                  model: CategoriaC,
                },
              ],
            },
          ],
        },
      ],
      order: [["dataUpload", "DESC"]],
    });

    res.json({ success: true, data: cursos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar cursos do formador.",
      details: error.message,
    });
  }
};

controllers.listarCursosPorIdFormador = async (req, res) => {
  try {
    const formadorId = req.params.id;

    const cursos = await Curso.findAll({
      where: { formadorId },
      include: [
        {
          model: TopicoC,
          include: [
            {
              model: AreaC,
              include: [
                {
                  model: CategoriaC,
                },
              ],
            },
          ],
        },
      ],
      order: [["dataUpload", "DESC"]],
    });

    res.json({ success: true, data: cursos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar cursos do formador.",
      details: error.message,
    });
  }
};

controllers.notasTarefasPorUtilizador = async (req, res) => {
  try {
    const { cursoId, utilizadorId } = req.params;

    // Vai buscar todas as tarefas do curso
    const tarefas = await Tarefa.findAll({
      where: { cursoId },
      attributes: ["id", "titulo"],
      raw: true,
    });

    // Vai buscar todas as submissões desse utilizador nessas tarefas
    const submissoes = await SubmissaoTarefa.findAll({
      where: {
        utilizadorId,
        idTarefa: tarefas.map(t => t.id),
      },
      attributes: ["idTarefa", "nota"],
      raw: true,
    });

    // Junta tarefas e submissões
    const resultado = tarefas.map(tarefa => {
      const sub = submissoes.find(s => s.idTarefa === tarefa.id);
      return {
        tarefa: tarefa.titulo,
        nota: sub ? sub.nota : null,
      };
    });

    res.json({ success: true, data: resultado });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao obter notas das tarefas do utilizador.",
      details: error.message,
    });
  }
};

controllers.listarConteudosPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;

    const conteudos = await Conteudo.findAll({
      where: { cursoId },
      include: [
        {
          model: ConteudoFicheiro,
          as: "ficheiros"
        }
      ],
      order: [["ordem", "ASC"]],
    });

    if (!conteudos || conteudos.length === 0) {
      return res.json({
        success: false,
        message: "O curso não tem conteúdos.",
        data: []
      });
    }

    res.json({ success: true, data: conteudos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar conteúdos do curso.",
      details: error.message,
    });
  }
};


controllers.listarTarefasPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;

    const tarefas = await Tarefa.findAll({
      where: { cursoId },
      include: [
        {
          model: TarefaFicheiro,
          as: "ficheiros"
        }
      ],
      order: [["dataLimite", "ASC"]],
    });

    if (!tarefas || tarefas.length === 0) {
      return res.json({
        success: false,
        message: "O curso não tem tarefas.",
        data: []
      });
    }

    res.json({ success: true, data: tarefas });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar tarefas do curso.",
      details: error.message,
    });
  }
};

controllers.listarAvisosPorCurso = async (req, res) => {
  try {
    const { cursoId } = req.params;

    const avisos = await AvisoCurso.findAll({
      where: { cursoId },
      order: [["dataPublicacao", "DESC"]],
    });

    res.json({ success: true, data: avisos });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao listar avisos do curso.",
      details: error.message,
    });
  }
};


// Detail curso
controllers.curso_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const curso = await Curso.findByPk(id, {
      include: [
        TopicoC,
        { model: Utilizador, as: "formador", attributes: ["nomeUtilizador"] },
      ],
    });
    if (!curso) {
      return res
        .status(404)
        .json({ success: false, message: "Curso não encontrado." });
    }
    res.json({ success: true, data: curso });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao encontrar curso.",
      details: error.message,
    });
  }
};

// Criar curso
controllers.curso_create = async (req, res) => {
  try {
    const {
      nome,
      dataUpload,
      tipoCurso,
      vaga,
      dataLimiteInscricao,
      estado,
      descricaoCurso,
      duracao,
      nivel,
      pontuacao,
      dataInicio,
      dataFim,
      imagemBanner,
      topicoId,
      formadorId,
    } = req.body;

    if (
      !nome ||
      !dataUpload ||
      !descricaoCurso ||
      !duracao ||
      !dataInicio ||
      !dataFim ||
      !topicoId ||
      !formadorId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Campos obrigatórios faltando." });
    }

    // Verificar se tópico existe
    const topico = await TopicoC.findByPk(topicoId);
    if (!topico) {
      return res
        .status(400)
        .json({ success: false, message: "Tópico inválido." });
    }

    if (dataInicio && dataFim && dataInicio > dataFim) {
      return res.status(400).json({
        success: false,
        message: "Data de início não pode ser após a data de fim.",
      });
    }

    // valores para vaga e capacidadeMaxima
    let initialVaga = null; // Vagas restantes
    let initialCapacidadeMaxima = null; // Capacidade total

    if (tipoCurso === "Presencial") {
      if (vaga === undefined || vaga === null || vaga < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Para cursos presenciais, o número de vagas deve ser um valor positivo.",
        });
      }
      initialVaga = vaga; // Vagas restantes começam com a capacidade total
      initialCapacidadeMaxima = vaga; // Capacidade máxima é a capacidade total
    }
    // Para cursos online permanecem null (sem limite).

    const novoCurso = await Curso.create({
      nome,
      dataUpload,
      tipoCurso,
      vaga: initialVaga,
      capacidadeMaxima: initialCapacidadeMaxima,
      dataLimiteInscricao,
      estado,
      visibilidadeStatus: "visivel",
      descricaoCurso,
      duracao,
      nivel,
      pontuacao,
      numParticipante: 0,
      imagemBanner,
      dataInicio,
      dataFim,
      previousCourseId: null,
      topicoId,
      formadorId,
    });

    res.status(201).json({ success: true, data: novoCurso });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao criar curso.",
      details: error.message,
    });
  }
};

// Atualizar curso
controllers.curso_update = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      nome,
      dataUpload,
      tipoCurso,
      vaga,
      dataLimiteInscricao,
      estado,
      visibilidadeStatus,
      descricaoCurso,
      duracao,
      nivel,
      pontuacao,
      imagemBanner,
      dataInicio,
      dataFim,
      topicoId,
      formadorId,
    } = req.body;

    const curso = await Curso.findByPk(id);
    if (!curso) {
      return res
        .status(404)
        .json({ success: false, message: "Curso não encontrado." });
    }

    if (topicoId) {
      const topico = await TopicoC.findByPk(topicoId);
      if (!topico) {
        return res
          .status(400)
          .json({ success: false, message: "Tópico inválido." });
      }
    }

    if (tipoCurso === "Presencial") {
      if (vaga === undefined || vaga === null || vaga < 0) {
        return res.status(400).json({
          success: false,
          message:
            "Para cursos presenciais, o número de vagas deve ser um valor positivo.",
        });
      }
    }

    if (dataInicio && dataFim && dataInicio > dataFim) {
      return res.status(400).json({
        success: false,
        message: "Data de início não pode ser após a data de fim.",
      });
    }

    const dadosParaAtualizar = {
      nome,
      dataUpload,
      tipoCurso,
      dataLimiteInscricao,
      estado,
      descricaoCurso,
      duracao,
      nivel,
      pontuacao,
      imagemBanner,
      dataInicio,
      dataFim,
      visibilidadeStatus,
      topicoId,
      formadorId,
    };

    if (tipoCurso === "Presencial") {
      const agora = new Date();

      if (curso.dataLimiteInscricao && agora > curso.dataLimiteInscricao) {
        return res.status(400).json({
          message:
            "Não é possível alterar o número de vagas após a data-limite de inscrição.",
        });
      }

      if (vaga !== undefined && vaga !== null && vaga >= 0) {
        if (vaga < curso.numParticipante) {
          return res.status(400).json({
            success: false,
            message: `Não é possível definir a capacidade para ${vaga}, pois já existem ${curso.numParticipante} participantes inscritos.`,
          });
        }

        dadosParaAtualizar.capacidadeMaxima = vaga;
        dadosParaAtualizar.vaga = vaga - curso.numParticipante;
      } else {
        return res.status(400).json({
          success: false,
          message:
            "Para cursos presenciais, a capacidade máxima (vagas) deve ser um valor positivo.",
        });
      }
    } else if (tipoCurso === "Online") {
      dadosParaAtualizar.vaga = null;
      dadosParaAtualizar.capacidadeMaxima = null;
    }

    await curso.update(dadosParaAtualizar);

    res.json({ success: true, data: curso });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao atualizar curso.",
      details: error.message,
    });
  }
};

controllers.curso_renew = async (req, res) => {
  try {
    const cursoIdParaRenovar = req.params.id;

    const cursoOriginal = await Curso.findByPk(cursoIdParaRenovar);
    if (!cursoOriginal) {
      return res.status(404).json({
        success: false,
        message: "Curso original não encontrado para renovação.",
      });
    }

    // Determinar vagas e capacidadeMaxima
    let novaVaga = null;
    let novaCapacidadeMaxima = null;
    if (cursoOriginal.tipoCurso === "Presencial") {
      novaVaga = cursoOriginal.capacidadeMaxima; // ou cursoOriginal.vaga
      novaCapacidadeMaxima = cursoOriginal.capacidadeMaxima;
    }

    // Criar novo curso (renovação)
    const novoCursoData = {
      nome: cursoOriginal.nome,
      descricaoCurso: cursoOriginal.descricaoCurso,
      duracao: cursoOriginal.duracao,
      numParticipante: 0,
      tipoCurso: cursoOriginal.tipoCurso,
      vaga: novaVaga,
      capacidadeMaxima: novaCapacidadeMaxima,
      dataUpload: new Date(),
      dataLimiteInscricao: null,
      dataInicio: null,
      dataFim: null,
      estado: 0,
      visibilidadeStatus: "oculto",
      nivel: cursoOriginal.nivel,
      pontuacao: cursoOriginal.pontuacao,
      imagemBanner: cursoOriginal.imagemBanner,
      previousCourseId: cursoOriginal.id,
      topicoId: cursoOriginal.topicoId,
      formadorId: cursoOriginal.formadorId,
    };

    const novoCurso = await Curso.create(novoCursoData);

    res.status(201).json({
      success: true,
      message: "Curso renovado com sucesso! Altere as novas datas do curso.",
      data: novoCurso,
    });
  } catch (error) {
    console.error("Erro ao renovar curso:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao renovar curso.",
      details: error.message,
    });
  }
};

// Apagar curso
controllers.curso_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const curso = await Curso.findByPk(id);

    if (!curso) {
      return res
        .status(404)
        .json({ success: false, message: "Curso não encontrado." });
    }

    await curso.destroy();

    res.json({ success: true, message: "Curso apagado com sucesso." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro ao apagar curso.",
      details: error.message,
    });
  }
};

controllers.uploadImagemCurso = async (req, res) => {
  try {
    const file = req.file;
    const cursoId = req.params.id;

    if (!file) {
      return res
        .status(400)
        .json({ success: false, message: "Nenhum arquivo de imagem enviado." });
    }

    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: "Apenas imagens JPEG, PNG ou JPG são permitidas.",
      });
    }

    const curso = await Curso.findByPk(cursoId);
    if (!curso) {
      return res
        .status(404)
        .json({ success: false, message: "Curso não encontrado." });
    }

    // Gerar nome único para o ficheiro
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${cursoId}-${crypto
      .randomBytes(16)
      .toString("hex")}${fileExtension}`;
    const key = `imagem-curso/${uniqueFileName}`;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));
    const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

    const oldImageUrl = curso.imagemBanner;

    // Atualizar URL no banco
    await curso.update({ imagemBanner: imageUrl });

    // Remover imagem antiga do S3 se existir
    if (oldImageUrl) {
      const oldImageKey = getKeyFromS3Url(oldImageUrl);
      if (oldImageKey) {
        try {
          await s3.send(
            new DeleteObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: oldImageKey,
            })
          );
          console.log(`Imagem antiga (${oldImageKey}) removida do S3.`);
        } catch (err) {
          console.error(
            `Erro ao remover imagem antiga (${oldImageKey}):`,
            err.message
          );
        }
      }
    }

    res.json({
      success: true,
      message: "Imagem enviada e associada ao curso com sucesso!",
      imageUrl,
    });
  } catch (error) {
    console.error("Erro ao enviar imagem do curso:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao enviar imagem.",
      details: error.message,
    });
  }
};

controllers.curso_mais_popular_mes = async (req, res) => {
  try {
    const now = new Date();

    const startOfMonth = new Date(
      now.getFullYear(),

      now.getMonth(),

      1,

      0,

      0,

      0
    );

    const endOfMonth = new Date(
      now.getFullYear(),

      now.getMonth() + 1,

      0,

      23,

      59,

      59
    );

    const result = await Inscricao.findAll({
      attributes: [
        ["ID_CURSO", "cursoId"], // <-- Usa o nome real da coluna e dá um alias

        [fn("COUNT", col("ID_CURSO")), "numInscricoes"],
      ],

      where: {
        dataInscricao: {
          [Op.between]: [startOfMonth, endOfMonth],
        },
      },

      group: ["ID_CURSO"],

      order: [[fn("COUNT", col("ID_CURSO")), "DESC"]],

      limit: 1,

      raw: true,
    });

    if (!result.length) {
      return res.json({ success: true, data: null });
    }

    // Garante que pega o campo certo

    const cursoId = result[0].cursoId || result[0].ID_CURSO;

    if (!cursoId) {
      return res.json({ success: true, data: null });
    }

    const curso = await Curso.findByPk(cursoId);

    res.json({ success: true, data: curso });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: "Erro ao buscar curso mais popular do mês.",

      details: error.message,
    });
  }
};

module.exports = controllers;
