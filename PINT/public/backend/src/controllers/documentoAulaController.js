const DocumentoAula = require("../model/DocumentoAula");
const AulaAssincrona = require("../model/AulaAssincrona");
const { s3, PutObjectCommand, DeleteObjectCommand, getKeyFromS3Url } = require("../config/s3Config");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

const controllers = {};

// Listar ficheiros de uma aula assíncrona
controllers.listarFicheirosAula = async (req, res) => {
  try {
    const aulaAssincronaId = req.params.aulaAssincronaId;
    if (!aulaAssincronaId) {
      return res.status(400).json({ success: false, message: "ID da aula assíncrona é obrigatório." });
    }

    const ficheiros = await DocumentoAula.findAll({
      where: { aulaAssincronaId },
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
    console.error("Erro ao listar ficheiros da aula:", err);
    res.status(500).json({ success: false, message: "Erro ao listar ficheiros da aula.", details: err.message });
  }
};

// Upload de ficheiros associados a uma aula assíncrona
controllers.uploadFicheiroAula = async (req, res) => {
  try {
    const files = req.files;
    const aulaAssincronaId = req.params.aulaAssincronaId;
    const utilizadorId = req.utilizador.id;

    if (!files || files.length === 0) {
      return res.status(400).json({ success: false, message: "Nenhum ficheiro enviado." });
    }

    const aula = await AulaAssincrona.findByPk(aulaAssincronaId);
    if (!aula) {
      return res.status(404).json({ success: false, message: "Aula assíncrona não encontrada." });
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
      const uniqueName = `${aulaAssincronaId}-${utilizadorId}-${crypto.randomBytes(12).toString("hex")}${extension}`;
      const key = `documento/aula/${uniqueName}`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      }));

      const fileUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

      const savedFile = await DocumentoAula.create({
        aulaAssincronaId,
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
    console.error("Erro ao enviar ficheiros para aula:", err);
    res.status(500).json({ success: false, message: "Erro ao enviar ficheiros.", details: err.message });
  }
};

// Eliminar ficheiro de aula
controllers.deleteFicheiroAula = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const utilizadorId = req.utilizador.id;
    const utilizadorRole = req.utilizador.role;

    if (!fileId) {
      return res.status(400).json({ success: false, message: "ID do ficheiro é obrigatório." });
    }

    const ficheiro = await DocumentoAula.findByPk(fileId);
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
    console.error("Erro ao eliminar ficheiro de aula:", error);
    res.status(500).json({
      success: false,
      message: "Erro ao eliminar ficheiro.",
      details: error.message,
    });
  }
};

module.exports = controllers;