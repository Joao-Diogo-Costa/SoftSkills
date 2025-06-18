const Conteudo = require("../model/Conteudo");
const ConteudoFicheiro = require("../model/ConteudoFicheiro");
const { s3, PutObjectCommand, DeleteObjectCommand, getKeyFromS3Url } = require("../config/s3Config");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

const controllers = {};

// Listar ficheiros de um conteúdo
controllers.listarFicheirosConteudo = async (req, res) => {
  try {
    const conteudoId = req.params.conteudoId;
    if (!conteudoId) {
      return res.status(400).json({ success: false, message: "ID do conteúdo é obrigatório." });
    }

    const ficheiros = await ConteudoFicheiro.findAll({
      where: { conteudoId },
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
    console.error("Erro ao listar ficheiros do conteúdo:", err);
    res.status(500).json({ success: false, message: "Erro ao listar ficheiros do conteúdo.", details: err.message });
  }
};

// Upload de ficheiros associados a um conteúdo
controllers.uploadFicheiroConteudo = async (req, res) => {
  try {
    const files = req.files;
    const conteudoId = req.params.conteudoId;
    const utilizadorId = req.utilizador.id;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "Nenhum ficheiro enviado." });
    }

    const conteudo = await Conteudo.findByPk(conteudoId);
    if (!conteudo) {
      return res.status(404).json({ success: false, message: "Conteúdo não encontrado." });
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
      if (!allowedMimeTypes.includes(file.mimetype)) continue;

      const extension = path.extname(file.originalname);
      const uniqueName = `${conteudoId}-${utilizadorId}-${crypto.randomBytes(12).toString("hex")}${extension}`;
      const key = `documento/curso/conteudo/${uniqueName}`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));

      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

      const savedFile = await ConteudoFicheiro.create({
        conteudoId,
        utilizadorId,
        nomeOriginal: file.originalname,
        url: fileUrl,
        tipo: file.mimetype,
      });

      uploadedFiles.push(savedFile);
    }

    if (uploadedFiles.length === 0) {
      return res.status(400).json({ success: false, message: "Nenhum ficheiro válido foi enviado." });
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

  } catch (err) {
    console.error("Erro ao enviar ficheiros para conteúdo:", err);
    res.status(500).json({ success: false, message: "Erro ao enviar ficheiros.", details: err.message });
  }
};

// Eliminar ficheiro de conteúdo
controllers.deleteFicheiroConteudo = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const utilizadorId = req.utilizador.id;
    const utilizadorRole = req.utilizador.role;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "ID do ficheiro é obrigatório." });
    }

    const ficheiro = await ConteudoFicheiro.findByPk(fileId);
    if (!ficheiro) {
      return res.status(404).json({ success: false, message: "Ficheiro não encontrado." });
    }

    const isOwner = ficheiro.utilizadorId === utilizadorId;
    const isAdmin = ["gestor"].includes(utilizadorRole);

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: "Sem permissão para eliminar este ficheiro." });
    }

    const s3Key = getKeyFromS3Url(ficheiro.url);
    if (s3Key) {
      try {
        await s3.send(new DeleteObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: s3Key,
        }));
      } catch (err) {
        console.warn(`Erro ao apagar do S3: ${s3Key}`, err.message);
      }
    }

    await ficheiro.destroy();
    res.json({ success: true, message: "Ficheiro eliminado com sucesso." });

  } catch (error) {
    console.error("Erro ao eliminar ficheiro de conteúdo:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao eliminar ficheiro.",
      details: error.message,
    });
  }
};

module.exports = controllers;