const SubmissaoTarefa = require("../model/SubmissaoTarefa");
const Utilizador = require("../model/Utilizador");
const Tarefa = require("../model/Tarefa");
require("dotenv").config();
const multer  = require('multer');
const { s3, PutObjectCommand, DeleteObjectCommand, getKeyFromS3Url } = require("../config/s3Config");
const path = require('path');
const crypto = require("crypto");


const controllers = {};

// Listar Submissões
controllers.submissao_list = async (req, res) => {
  try {
    const lista = await SubmissaoTarefa.findAll({
      include: [Utilizador, Tarefa],
      order: [["dataEntrega", "DESC"]],
    });
    res.json({ success: true, data: lista });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar submissões.",details: error.message,});
  }
};


// Detalhe da Submissão
controllers.submissao_detail = async (req, res) => {
  try {
    const submissao = await SubmissaoTarefa.findByPk(req.params.id, {
      include: [Utilizador, Tarefa],
    });

    if (!submissao) {
      return res.status(404).json({ success: false, message: "Submissão não encontrada." });
    }

    res.json({ success: true, data: submissao });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao obter submissão.", details: error.message,});
  }
};

// Submeter ficheiro de tarefa
controllers.uploadSubmissaoTarefa = async (req, res) => {
  try {
    const file = req.file;
    const idTarefa = req.params.idTarefa;
    const utilizadorId = req.utilizador.id;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Nenhum ficheiro enviado.",
      });
    }

    const tarefa = await Tarefa.findByPk(idTarefa);
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

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: "Tipo de ficheiro não permitido." });
    }

    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${idTarefa}-${utilizadorId}-${crypto.randomBytes(12).toString("hex")}${fileExtension}`;
    const key = `documento/submissaoTarefa/${uniqueFileName}`;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));

    const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

    const submissao = await SubmissaoTarefa.create({
      nomeOriginal: file.originalname,
      url: fileUrl,
      tipo: file.mimetype,
      utilizadorId,
      idTarefa,
      dataEntrega: new Date(),
    });

    res.json({
      success: true,
      message: "Submissão efetuada com sucesso.",
      submissao: {
        id: submissao.id,
        nomeOriginal: submissao.nomeOriginal,
        url: submissao.url,
        tipo: submissao.tipo,
        dataEntrega: submissao.dataEntrega,
      },
    });
  } catch (error) {
    console.error("Erro ao submeter tarefa:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao submeter tarefa.",
      details: error.message,
    });
  }
};

// Eliminar submissão de tarefa
controllers.deleteSubmissaoTarefa = async (req, res) => {
  try {
    const submissaoId = req.params.submissaoId;
    const utilizadorId = req.utilizador.id;
    const utilizadorRole = req.utilizador.role;

    if (!submissaoId) {
      return res.status(400).json({ success: false, message: "ID da submissão é obrigatório." });
    }

    const submissao = await SubmissaoTarefa.findByPk(submissaoId);

    if (!submissao) {
      return res.status(404).json({ success: false, message: "Submissão não encontrada." });
    }

    const isOwner = submissao.utilizadorId === utilizadorId;
    const isAdminOrGestor = ["gestor"].includes(utilizadorRole);

    if (!isOwner && !isAdminOrGestor) {
      return res.status(403).json({ success: false, message: "Não tem permissão para eliminar esta submissão." });
    }

    const s3Key = getKeyFromS3Url(submissao.url);

    if (s3Key) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: s3Key,
        }));
      } catch (err) {
        console.error(`Erro ao eliminar do S3 (${s3Key}):`, err.message);
      }
    }

    await submissao.destroy();

    res.status(200).json({ success: true, message: "Submissão eliminada com sucesso." });

  } catch (error) {
    console.error("Erro ao eliminar submissão:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao eliminar submissão.",
      details: error.message,
    });
  }
};


module.exports = controllers;