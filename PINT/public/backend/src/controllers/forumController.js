const Forum = require("../model/Forum");
const TopicoC = require("../model/TopicoC");
const AreaC = require("../model/AreaC");
const CategoriaC = require("../model/CategoriaC");
require("dotenv").config();
const multer  = require('multer');
const { s3, PutObjectCommand, DeleteObjectCommand, getKeyFromS3Url } = require("../config/s3Config");
const path = require('path');
const crypto = require("crypto");

const controllers = {};

// Listar Fóruns
controllers.forum_list = async (req, res) => {
  try {
    const lista = await Forum.findAll({
      include: [{
        model: TopicoC,
        include: [{
          model: AreaC,
          include: [CategoriaC]
        }]
      }],
      order: [["id", "ASC"]],
    });
    res.json({ success: true, data: lista });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao listar fÃ³runs.", details: error.message });
  }
};

// Detalhar Fórum
controllers.forum_detail = async (req, res) => {
  try {
    const forum = await Forum.findByPk(req.params.id, {
      include: [TopicoC],
    });
    if (!forum) {
      return res.status(404).json({ success: false, message: "Fórum não encontrado." });
    }
    res.json({ success: true, data: forum });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao buscar fórum.", details: error.message,});
  }
};

// Criar Fórum
controllers.forum_create = async (req, res) => {
  try {
    const { nome, descricao, imagemForum, topicoId } = req.body;

    if (!nome || !topicoId) {
      return res.status(400).json({ success: false, message: "Nome e ID do tópico são obrigatórios." });
    }

    const topico = await TopicoC.findByPk(topicoId);
    if (!topico) {
      return res.status(400).json({ success: false, message: "Tópico inválido." });
    }

    const novoForum = await Forum.create({ nome, descricao, imagemForum, topicoId });
    res.status(201).json({ success: true, data: novoForum });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao criar fórum.", details: error.message });
  }
};

// Atualizar Fórum
controllers.forum_update = async (req, res) => {
  try {
    const { nome, descricao, imagemForum, topicoId } = req.body;
    const forum = await Forum.findByPk(req.params.id);

    if (!forum) {
      return res.status(404).json({ success: false, message: "Fórum não encontrado." });
    }

    if (topicoId) {
      const topico = await TopicoC.findByPk(topicoId);
      if (!topico) {
        return res.status(400).json({ success: false, message: "Tópico inválido." });
      }
    }

    await forum.update({ nome, descricao, imagemForum, topicoId });

    res.json({ success: true, data: forum });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao atualizar fórum.", details: error.message });
  }
};

// Apagar Fórum
controllers.forum_delete = async (req, res) => {
  try {
    const forum = await Forum.findByPk(req.params.id);
    if (!forum) {
      return res.status(404).json({ success: false, message: "Fórum não encontrado." });
    }

    await forum.destroy();
    res.json({ success: true, message: "Fórum removido com sucesso." });
  } catch (error) {
    res.status(500).json({ success: false, message: "Erro ao remover fórum.", details: error.message,});
  }
};

// Imagem Forum
controllers.uploadImagemForum = async (req, res) => {
  try {
    const file = req.file;
    const forumId = req.params.forumId;

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

    const forum = await Forum.findByPk(forumId);
    if (!forum) {
      return res
        .status(404)
        .json({ success: false, message: "Forum não encontrado." });
    }

    // Gerar nome único para o ficheiro
    const fileExtension = path.extname(file.originalname);
    const uniqueFileName = `${forumId}-${crypto
      .randomBytes(16)
      .toString("hex")}${fileExtension}`;
    const key = `imagem-forum/${uniqueFileName}`;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    await s3.send(new PutObjectCommand(params));
    const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

    const oldImageUrl = forum.imagemForum;

    // Atualizar URL no banco
    await forum.update({ imagemForum: imageUrl });

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
      message: "Imagem enviada e associada ao forum com sucesso!",
      imageUrl,
    });
  } catch (error) {
    console.error("Erro ao enviar imagem do forum:", error);
    res.status(500).json({
      success: false,
      message: "Erro interno do servidor ao enviar imagem.",
      details: error.message,
    });
  }
};

module.exports = controllers;
