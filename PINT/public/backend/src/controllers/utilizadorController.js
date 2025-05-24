const Utilizador = require("../model/Utilizador");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
require("dotenv").config();
const multer  = require('multer');
const { s3, PutObjectCommand, DeleteObjectCommand, getKeyFromS3Url } = require("../config/s3Config");
const path = require('path');

const controllers = {};

// Listar todos os utilizadores
controllers.utilizador_list = async (req, res) => {
    try {
        const utilizadores = await Utilizador.findAll({
            order: [['id', 'ASC']]
        });
        res.json({ success: true, data: utilizadores });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao listar utilizadores.", error: error.message });
    }
};

// Obter detalhes de um utilizador
controllers.utilizador_detail = async (req, res) => {
    try {
        const id = req.params.id;

        const utilizador = await Utilizador.findByPk(id);

        if (utilizador) {
            res.json({ success: true, data: utilizador });
        } else {
            res.status(404).json({ success: false, message: "Utilizador não encontrado." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao obter utilizador.", error: error.message });
    }
};

// Criar novo utilizador
controllers.utilizador_create = async (req, res) => {
    try {
        const { nomeUtilizador,dataNasc,nTel,email,password, imagemPerfil, role, } = req.body;

        if (!nomeUtilizador || !dataNasc || !nTel || !email || !password || !role) {
            return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
        }

        const utilizadorExistente = await Utilizador.findOne({ where: { email } });

        if (utilizadorExistente) {
            return res.status(409).json({ message: "Já existe um utilizador com este email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const novoUtilizador = await Utilizador.create({
            nomeUtilizador,
            dataNasc,
            nTel,
            email,
            password: hashedPassword,
            imagemPerfil: imagemPerfil ?? null,
            role: role ?? "formando",

        });

        res.status(201).json({ success: true, data: novoUtilizador });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao criar utilizador.", error: error.message });
    }
};

// Atualizar utilizador
controllers.utilizador_update = async (req, res) => {
    try {
        const id = req.params.id;
        const { nomeUtilizador, dataNasc, nTel, email, password } = req.body;

        const utilizador = await Utilizador.findByPk(id);

        if (!utilizador) {
            return res.status(404).json({ erro: "Utilizador não encontrado." });
        }

        const dadosAtualizados = {
        nomeUtilizador,
        dataNasc,
        nTel,
        email,
        imagemPerfil,
        role,
        pontos,
        };

        if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        dadosAtualizados.password = hashedPassword;
        }

        await utilizador.update(dadosAtualizados);

        res.json({ success: true, data: utilizador });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao atualizar utilizador.", error: error.message });
    }
};

// Eliminar utilizador
controllers.utilizador_delete = async (req, res) => {
    try {
        const id = req.params.id;

        const utilizador = await Utilizador.findByPk(id);

        if (!utilizador) {
            return res.status(404).json({ erro: "Utilizador não encontrado." });
        }

        await utilizador.destroy();

        res.json({ success: true, message: "Utilizador eliminado com sucesso." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao eliminar utilizador.", error: error.message });
    }
};

// Para as imagens de perfil utilizador
controllers.uploadImagemPerfil = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Nenhum arquivo de imagem enviado." });
    }


    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({ success: false, message: 'Apenas imagens JPEG, PNG ou JPG são permitidas.' });
    }

    // 1. Gerar um nome de arquivo único para evitar colisões e sobrescritas
    // Usar o ID do utilizador (garantido por checkToken) e um UUID/timestamp
    const utilizadorId = req.utilizador.id; 
    const fileExtension = path.extname(file.originalname); 
    const uniqueFileName = `${utilizadorId}-${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    const key = `imagem-perfil/${uniqueFileName}`;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer, 
      ContentType: file.mimetype, 
    };

    await s3.send(new PutObjectCommand(params));
    const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

    const oldImageUrl = req.utilizador.imagemPerfil;

    // 2. Atualizar o utilizador no banco de dados
    // req.utilizador é o objeto do utilizador vindo do middleware checkToken
    await req.utilizador.update({ imagemPerfil: imageUrl });

    // 5. Tentar remover a imagem antiga do S3 (se existir)
    if (oldImageUrl) {
      const oldImageKey = getKeyFromS3Url(oldImageUrl);

      if (oldImageKey) {
        try {
          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: oldImageKey,
          }));
          console.log(`Imagem antiga (${oldImageKey}) removida com sucesso do S3.`);
        } catch (s3DeleteError) {
          // não impedir que a operação principal (upload e atualização do DB) seja bem-sucedida.
          // Isto é importante porque o upload da nova imagem e a atualização do DB são mais críticos do que a remoção da antiga.
          console.error(`Erro ao remover imagem antiga (${oldImageKey}) do S3:`, s3DeleteError.message);
        }
      }
    }

    res.json({ success: true, message: "Imagem enviada e associada ao utilizador com sucesso!", imageUrl });
  } catch (error) {
    console.error("Erro ao enviar imagem de perfil:", error);
    res.status(500).json({ success: false, message: "Erro interno do servidor ao enviar imagem.", details: error.message });
  }
};







module.exports = controllers;