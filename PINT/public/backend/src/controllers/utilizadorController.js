const Utilizador = require("../model/Utilizador");
const Curso = require("../model/Curso");
const Inscricao = require("../model/Inscricao");
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
            return res.status(400).json({ success: false, message: "Todos os campos são obrigatórios." });
        }

        const utilizadorExistente = await Utilizador.findOne({ where: { email } });

        if (utilizadorExistente) {
            return res.status(409).json({ success: false, message: "Já existe um utilizador com este email." });
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

        res.status(201).json({ success: true, message: "Utilizador criado com sucesso!", data: novoUtilizador });
    } catch (error) {
        console.error("ERRO NO BACKEND:", error);
        res.status(500).json({ success: false, message: "Erro ao criar utilizador.", error: error.message });
    }
};

// Atualizar utilizador
controllers.utilizador_update = async (req, res) => {
    try {
        const id = req.params.id;
        const { nomeUtilizador, dataNasc, nTel, email, password, imagemPerfil,role, pontos } = req.body;

        const utilizador = await Utilizador.findByPk(id);

        if (!utilizador) {
            return res.status(404).json({ erro: "Utilizador não encontrado." });
        }

        if (email && email !== utilizador.email) {
        const emailExistente = await Utilizador.findOne({ where: { email } });
        if (emailExistente) {
            return res.status(409).json({ success: false, message: "Já existe um utilizador com este email." });
        }
        }

        // Lógica especial para mudança de role
        if (role && role !== utilizador.role) {
            if (utilizador.role === "formador" && role === "formando") {
                // Transferir cursos do formador para admin (id=1)
                await Curso.update(
                    { idFormador: 1 },
                    { where: { idFormador: utilizador.id } }
                );
            }
            if (utilizador.role === "formando" && role === "formador") {
                // Remover inscrições do formando
                if (Inscricao) {
                    await Inscricao.destroy({
                        where: { idUtilizador: utilizador.id }
                    });
                }
            }
        }

        const dadosAtualizados = {};
        if (nomeUtilizador !== undefined) dadosAtualizados.nomeUtilizador = nomeUtilizador;
        if (dataNasc !== undefined) dadosAtualizados.dataNasc = dataNasc;
        if (nTel !== undefined) dadosAtualizados.nTel = nTel;
        if (email !== undefined) dadosAtualizados.email = email;
        if (imagemPerfil !== undefined) dadosAtualizados.imagemPerfil = imagemPerfil;
        if (role !== undefined) dadosAtualizados.role = role;
        if (pontos !== undefined) dadosAtualizados.pontos = pontos;

        if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        dadosAtualizados.password = hashedPassword;
        }

        await utilizador.update(dadosAtualizados);
        const utilizadorAtualizado = await Utilizador.findByPk(id);

        res.json({ success: true, data: utilizadorAtualizado });
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
        
        if (utilizador.role === "admin") {
            return res.status(403).json({ success: false, message: "Não é permitido apagar um utilizador admin." });
        }

        await utilizador.destroy();

        res.json({ success: true, message: "Utilizador eliminado com sucesso." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Erro ao eliminar utilizador.", error: error.message });
    }
};

const DEFAULT_ADMIN_URL = "https://pint-2025.s3.eu-north-1.amazonaws.com/imagem-perfil/user-admin.png"
const DEFAULT_PROFILE_URL = "https://pint-2025.s3.eu-north-1.amazonaws.com/imagem-perfil/default_profile_pic.jpg";

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
    // Permitir que o admin envie o id do utilizador a editar
    const id = req.body.id || req.query.id || req.utilizador.id;
    const utilizador = await Utilizador.findByPk(id);

    if (!utilizador) {
      return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
    }

    const fileExtension = path.extname(file.originalname); 
    const uniqueFileName = `${id}-${crypto.randomBytes(16).toString('hex')}${fileExtension}`;
    const key = `imagem-perfil/${uniqueFileName}`;

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: key,
      Body: file.buffer, 
      ContentType: file.mimetype, 
    };


    await s3.send(new PutObjectCommand(params));
    const imageUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${key}`;

    const oldImageUrl = utilizador.imagemPerfil;

    // 2. Atualizar o utilizador no banco de dados
    await utilizador.update({ imagemPerfil: imageUrl });

    // 3. Tentar remover a imagem antiga do S3 (se existir)
    if (oldImageUrl && oldImageUrl !== DEFAULT_PROFILE_URL && oldImageUrl !== DEFAULT_ADMIN_URL) {
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