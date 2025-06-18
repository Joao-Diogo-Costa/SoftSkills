const Forum = require("../model/Forum");
const Utilizador = require("../model/Utilizador");
const ForumFicheiro = require("../model/ForumFicheiro");
require("dotenv").config();
const multer  = require('multer');
const { s3, PutObjectCommand, DeleteObjectCommand, getKeyFromS3Url } = require("../config/s3Config");
const path = require('path');
const crypto = require("crypto");


const controllers = {};

// Listar ficheiros de um fórum
controllers.listarFicheirosForum = async (req, res) => {
  try {
    const forumId = req.params.forumId;
    if (!forumId) {
      return res.status(400).json({ success: false, message: "ID do fórum é obrigatório." });
    }

    const ficheiros = await ForumFicheiro.findAll({
      where: { forumId },
      include: [
        {
          model: Utilizador,
          attributes: ["id", "nomeUtilizador", "email"]
        }
      ],
      order: [["id", "DESC"]]
    });

    res.json({
      success: true,
      ficheiros: ficheiros.map(f => ({
        id: f.id,
        nomeOriginal: f.nomeOriginal,
        url: f.url,
        tipo: f.tipo,
        utilizador: f.Utilizador ? {
          id: f.Utilizador.id,
          nomeUtilizador: f.Utilizador.nomeUtilizador,
          email: f.Utilizador.email
        } : null
      }))
    });
  } catch (err) {
    console.error("Erro ao listar ficheiros do fórum:", err);
    res.status(500).json({ success: false, message: "Erro ao listar ficheiros do fórum.", details: err.message });
  }
};

controllers.uploadFicheiroForum = async (req, res) => {
  try {
    const files = req.files;
    const forumId = req.params.forumId;
    const utilizadorId = req.utilizador.id;

    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nenhum ficheiro enviado.",
      });
    }

    const forum = await Forum.findByPk(forumId);
    if (!forum) {
      return res.status(404).json({ success: false, message: "Fórum não encontrado." });
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
      const uniqueFileName = `${forumId}-${utilizadorId}-${crypto.randomBytes(12).toString("hex")}${fileExtension}`;
      const key = `documento/forum/${uniqueFileName}`;

      const params = {
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      };

      await s3.send(new PutObjectCommand(params));

      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

      const savedFile = await ForumFicheiro.create({
        forumId,
        utilizadorId,
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
    console.error("Erro ao enviar ficheiros:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao enviar ficheiros.",
      details: error.message,
    });
  }
};

controllers.deleteFicheiroForum = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const utilizadorId = req.utilizador.id;
    const utilizadorRole = req.utilizador.role;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "ID do ficheiro é obrigatório." });
    }

    const forumFicheiro = await ForumFicheiro.findByPk(fileId);

    if (!forumFicheiro) {
      console.warn(`Ficheiro não encontrado (ID: ${fileId}).`);
      return res.status(404).json({ success: false, message: "Ficheiro não encontrado." });
    }

    const isOwner = forumFicheiro.utilizadorId === utilizadorId;
    const isAdminOrGestor = ["gestor"].includes(utilizadorRole);

    if (!isOwner && !isAdminOrGestor) {
      console.warn(`Acesso negado: Utilizador ${utilizadorId} (${utilizadorRole}) tentou apagar ficheiro ${fileId} de ${forumFicheiro.utilizadorId}.`);
      return res.status(403).json({ success: false, message: "Você não tem permissão para eliminar este ficheiro." });
    }

    const s3Key = getKeyFromS3Url(forumFicheiro.url);

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
      console.warn(`Key S3 inválida ou não encontrada no URL (${forumFicheiro.url}).`);
    }

    await forumFicheiro.destroy();
    console.log(`Ficheiro ${fileId} eliminado da base de dados.`);

    res.status(200).json({ success: true, message: "Ficheiro eliminado com sucesso." });

  } catch (error) {
    console.error("Erro no deleteFicheiroForum:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao eliminar ficheiro.",
      details: error.message,
    });
  }
};

module.exports = controllers;