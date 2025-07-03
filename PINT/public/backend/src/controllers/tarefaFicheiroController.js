const TarefaFicheiro = require("../model/TarefaFicheiro");
const Tarefa = require("../model/Tarefa");
const { s3, PutObjectCommand, DeleteObjectCommand, getKeyFromS3Url } = require("../config/s3Config");
const path = require("path");
const crypto = require("crypto");

const controllers = {};

// Listar ficheiros de uma tarefa
controllers.listarFicheirosTarefa = async (req, res) => {
  try {
    const tarefaId = req.params.tarefaId;
    if (!tarefaId) {
      return res.status(400).json({ success: false, message: "ID da tarefa é obrigatório." });
    }

    const ficheiros = await TarefaFicheiro.findAll({
      where: { tarefaId },
      order: [["id", "DESC"]]
    });

    res.json({
      success: true,
      ficheiros: ficheiros.map(f => ({
        id: f.id,
        nomeOriginal: f.nomeOriginal,
        url: f.url,
        tipo: f.tipo
      }))
    });
  } catch (err) {
    console.error("Erro ao listar ficheiros da tarefa:", err);
    res.status(500).json({ success: false, message: "Erro ao listar ficheiros da tarefa.", details: err.message });
  }
};

// Upload de ficheiros de enunciado da tarefa (formador)
controllers.uploadTarefaFicheiro = async (req, res) => {
  try {
    const files = req.files;
    const tarefaId = req.params.tarefaId;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nenhum ficheiro enviado.",
      });
    }

    const tarefa = await Tarefa.findByPk(tarefaId);
    if (!tarefa) {
      return res.status(404).json({ success: false, message: "Tarefa não encontrada." });
    }

    const allowedMimeTypes = [
      "application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/zip", "application/x-rar-compressed",
      "text/plain", "image/jpeg", "image/png", "image/jpg",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ];

    const uploadedFiles = [];

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        continue;
      }

      const fileExtension = path.extname(file.originalname);
      const uniqueFileName = `${tarefaId}-${crypto.randomBytes(12).toString("hex")}${fileExtension}`;
      const key = `documento/tarefa/${uniqueFileName}`;

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));

      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

      const savedFile = await TarefaFicheiro.create({
        tarefaId,
        nomeOriginal: file.originalname,
        url: fileUrl,
        tipo: file.mimetype,
      });

      uploadedFiles.push(savedFile);
      console.log(`Ficheiro "${file.originalname}" enviado e registado.`);
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nenhum ficheiro válido foi enviado.",
      });
    }

    res.json({
      success: true,
      message: "Ficheiros enviados com sucesso.",
      files: uploadedFiles.map(f => ({
        id: f.id,
        nomeOriginal: f.nomeOriginal,
        url: f.url,
        tipo: f.tipo,
      })),
    });
  } catch (error) {
    console.error("Erro ao enviar ficheiros da tarefa:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar ficheiros da tarefa.",
      details: error.message,
    });
  }
};

// Eliminar ficheiro de enunciado da tarefa
controllers.deleteTarefaFicheiro = async (req, res) => {
  try {
    const fileId = req.params.fileId;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "ID do ficheiro é obrigatório." });
    }

    const tarefaFicheiro = await TarefaFicheiro.findByPk(fileId);

    if (!tarefaFicheiro) {
      return res.status(404).json({ success: false, message: "Ficheiro não encontrado." });
    }

    const s3Key = getKeyFromS3Url(tarefaFicheiro.url);

    if (s3Key) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: s3Key,
        }));
        console.log(`Ficheiro S3 eliminado com sucesso (${s3Key}).`);
      } catch (err) {
        console.error(`Erro ao eliminar do S3 (${s3Key}):`, err.message);
      }
    } else {
      console.warn(`Key S3 inválida ou não encontrada no URL (${tarefaFicheiro.url}).`);
    }

    await tarefaFicheiro.destroy();
    console.log(`Ficheiro ${fileId} eliminado da base de dados.`);

    res.status(200).json({ success: true, message: "Ficheiro eliminado com sucesso." });

  } catch (error) {
    console.error("Erro ao eliminar ficheiro da tarefa:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao eliminar ficheiro.",
      details: error.message,
    });
  }
};

module.exports = controllers;