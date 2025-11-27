const AvisoCurso = require("../model/AvisoCurso");
const Curso = require("../model/Curso");
const Utilizador = require("../model/Utilizador");
const Inscricao = require("../model/Inscricao");
const Notificacao = require("../model/Notificacao");
const nodemailer = require("nodemailer");
const admin = require('firebase-admin');
require("dotenv").config();
const fs = require('fs');

let serviceAccount;
if (fs.existsSync('/etc/secrets/serviceAccountKey.json')) {
    serviceAccount = require('/etc/secrets/serviceAccountKey.json');
} 
else {
    serviceAccount = require('../config/serviceAccountKey.json');
}
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const controllers = {};

// Listar todos os avisos
controllers.aviso_list = async (req, res) => {
  try {
    const avisos = await AvisoCurso.findAll({
      include: [Curso, Utilizador],
      order: [["id", "ASC"]],
    });

    res.json({ success: true, data: avisos });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erro ao listar avisos.",
        details: error.message,
      });
  }
};

// Detalhar aviso
controllers.aviso_detail = async (req, res) => {
  try {
    const id = req.params.id;
    const aviso = await AvisoCurso.findByPk(id, {
      include: [Curso, Utilizador],
    });

    if (!aviso) {
      return res
        .status(404)
        .json({ success: false, message: "Aviso não encontrado." });
    }

    res.json({ success: true, data: aviso });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erro ao buscar aviso.",
        details: error.message,
      });
  }
};

// Criar aviso
controllers.aviso_create = async (req, res) => {
  try {
    const { descricao, titulo, cursoId, utilizadorId, dataPublicacao, tipo } =
      req.body;

    if (!descricao || !titulo || !cursoId || !utilizadorId) {
      return res
        .status(400)
        .json({ success: false, message: "Campos obrigatórios ausentes." });
    }

    const curso = await Curso.findByPk(cursoId);
    const utilizador = await Utilizador.findByPk(utilizadorId);

    if (!curso) {
      return res
        .status(400)
        .json({ success: false, message: "ID de curso inválido." });
    }

    if (!utilizador) {
      return res
        .status(400)
        .json({ success: false, message: "ID de utilizador inválido." });
    }

    const novoAviso = await AvisoCurso.create({
      descricao,
      titulo,
      cursoId,
      utilizadorId,
      dataPublicacao: dataPublicacao || new Date(),
      tipo,
    });

    const inscricoesDoCurso = await Inscricao.findAll({
      where: { cursoId: cursoId },
      attributes: ["utilizadorId"],
    });

    const utilizadoresIds = inscricoesDoCurso.map((i) => i.utilizadorId);
    const utilizadores = await Utilizador.findAll({
      where: { id: utilizadoresIds },
      attributes: ["email", "nomeUtilizador", "tokenFCM"],
    });

    const tipoLabels = {
      aviso_geral: "Aviso Geral",
      alteracao_data: "Alteração de Data",
      nova_aula: "Nova Aula",
      novo_material: "Novo Material",
      avaliacao_disponivel: "Avaliação Disponível",
    };

    const tipoLabel = tipoLabels[tipo] || "Aviso Geral";

    const notificacoesCriadas = [];
    for (const inscricao of inscricoesDoCurso) {
      const notificacao = await Notificacao.create({
        utilizadorId: inscricao.utilizadorId,
        titulo: `Aviso: ${curso.nome} - ${titulo}`,
        mensagem: `"${descricao.substring(0, 100)}..."`,
        dataEnvio: new Date(),
        lida: false,
        cursoId: cursoId,
        tipo: tipo,
      });
      notificacoesCriadas.push(notificacao);
    }

    res.status(201).json({ success: true, data: novoAviso });

    // Envio de emails
    try {
      const transporter = require("nodemailer").createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      for (const u of utilizadores) {
        const mailOptions = {
          from: process.env.EMAIL_FROM,
          to: u.email,
          subject: `Novo aviso no curso "${curso.nome}" - SoftSkills`,
          html: `
            <div style="font-family: Arial, Helvetica, sans-serif; background: #f6f8fa; padding: 32px;">
              <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e0e7ef; padding: 32px;">
                <div style="text-align: center; margin-bottom: 24px;">
                  <img src="https://pint-2025.s3.eu-north-1.amazonaws.com/softskills_logo.png" alt="SoftSkills" style="height: 60px; margin-bottom: 8px;" />
                </div>
                <h2 style="color: #39639D; text-align: center;">${tipoLabel}</h2>
                <p style="color: #333;">Olá <strong>${u.nomeUtilizador}</strong>,</p>
                <p style="color: #333;">
                  Foi publicado um novo aviso no curso <strong>${curso.nome}</strong>.
                </p>
                <div style="background: #f5f9ff; border-left: 4px solid #39639D; padding: 16px 20px; margin: 24px 0; border-radius: 6px;">
                  <span style="display: block; color: #294873; font-weight: bold; margin-bottom: 8px; word-break: break-word; white-space: pre-line;">${titulo}</span>
                  <span style="color: #333; word-break: break-word; white-space: pre-line;">${descricao}</span>
                </div>
                <p style="color: #333;">
                  Para mais informações, aceda à plataforma SoftSkills.
                </p>
                <p style="color: #333;">
                  Cumprimentos,<br/>
                  Equipa SoftSkills
                </p>
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0e7ef;" />
                <p style="font-size: 13px; color: #888; text-align: center;">
                  &copy; ${new Date().getFullYear()} SoftSkills. Todos os direitos reservados.
                </p>
              </div>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions);
      }
    } catch (emailError) {
      console.error("Erro ao enviar email de aviso:", emailError);
    }

    // Envio de notificações push
    try {
      const tokens = utilizadores.map((u) => u.tokenFCM).filter(Boolean);
      if (tokens.length > 0) {
        for (const token of tokens) {
          const message = {
            notification: {
              title: `Aviso: ${curso.nome} - ${titulo}`,
              body: descricao.substring(0, 100) + "...",
            },
            token: token,
          };
          const response = await admin.messaging().send(message);
          console.log(response);
        }
      }
    } catch (pushError) {
      console.error("Erro ao enviar push notification:", pushError);
    }

  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erro ao criar aviso.",
        details: error.message,
      });
  }
};

// update aviso
controllers.aviso_update = async (req, res) => {
  try {
    const id = req.params.id;
    const { descricao, titulo, utilizadorId, dataPublicacao } = req.body;

    const aviso = await AvisoCurso.findByPk(id);
    if (!aviso) {
      return res
        .status(404)
        .json({ success: false, message: "Aviso não encontrado." });
    }

    if (utilizadorId) {
      const utilizador = await Utilizador.findByPk(utilizadorId);
      if (!utilizador) {
        return res
          .status(400)
          .json({ success: false, message: "ID de utilizador inválido." });
      }
    }

    const updateFields = {};
    if (descricao !== undefined) updateFields.descricao = descricao;
    if (titulo !== undefined) updateFields.titulo = titulo;
    if (utilizadorId !== undefined) updateFields.utilizadorId = utilizadorId;
    if (dataPublicacao !== undefined)
      updateFields.dataPublicacao = dataPublicacao;

    await aviso.update(updateFields);

    res.json({ success: true, data: aviso });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erro ao atualizar aviso.",
        details: error.message,
      });
  }
};

// Apagar aviso
controllers.aviso_delete = async (req, res) => {
  try {
    const id = req.params.id;
    const aviso = await AvisoCurso.findByPk(id);

    if (!aviso) {
      return res
        .status(404)
        .json({ success: false, message: "Aviso não encontrado." });
    }

    await aviso.destroy();

    res.json({ success: true, message: "Aviso apagado com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Erro ao apagar aviso.",
        details: error.message,
      });
  }
};

module.exports = controllers;

