const Utilizador = require("../model/Utilizador");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const controllers = {};

// Register
const { where } = require("sequelize");

controllers.register = async (req, res) => {
  try {
    const { nomeUtilizador, dataNasc, nTel, email, password, role } = req.body;

    if (!nomeUtilizador || !dataNasc || !nTel || !email || !password) {
      return res.status(400).json({
        message:
          "Nome, data de nascimento, telefone, email e password são obrigatórios.",
      });
    }

    const utilizadorExistente = await Utilizador.findOne({ where: { email } });
    if (utilizadorExistente) {
      return res.status(409).json({ message: "Este email já está registado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo utilizador
    const utilizador = await Utilizador.create({
      nomeUtilizador,
      dataNasc,
      nTel,
      email,
      password: hashedPassword,
      role: "formando",
      emailConfirmado: false,
      tokenConfirmacaoEmail: null,
      mustChangePassword: true,
      imagemPerfil:
        "https://pint-2025.s3.eu-north-1.amazonaws.com/imagem-perfil/default_profile_pic.jpg",
      pontos: 0,
      dataRegisto: new Date(),
    });

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: utilizador.email,
      subject: "Registo na plataforma SoftSkills",
      html: `
        <h3>Bem-vindo à plataforma SoftSkills, ${nomeUtilizador}!</h3>
        <p>O seu registo foi efetuado com sucesso.</p>
        <p><strong>Dados de acesso:</strong></p>
        <ul>
          <li><strong>Nome de utilizador:</strong> ${nomeUtilizador}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Password:</strong> ${password}</li>
        </ul>
        <p>Por razões de segurança, recomendamos que altere a sua palavra-passe após o primeiro login.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message:
        "Utilizador registado com sucesso. Os dados foram enviados por e-mail",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao registar utilizador.",
      details: error.message,
    });
  }
};

// Função para gerar um token JWT
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Login
controllers.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email e password são obrigatórios." });
    }

    const utilizador = await Utilizador.findOne({ where: { email } });

    if (!utilizador) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const passValida = await bcrypt.compare(password, utilizador.password);

    if (!passValida) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const token = signToken(utilizador.id);

    const { password: _, ...utilizadorSemPassword } = utilizador.toJSON();
    res.json({
      success: true,
      message: "Login bem-sucedido.",
      token,
      data: utilizadorSemPassword,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no login.", details: error.message });
  }
};

const createResetPasswordToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { token: resetToken, hashedToken };
};

controllers.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório." });
    }

    const utilizador = await Utilizador.findOne({ where: { email } });

    if (!utilizador) {
      return res.status(401).json({ message: "Este e-mail não existe" });
    }

    const { token, hashedToken } = createResetPasswordToken();
    const passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutos

    await utilizador.update({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: passwordResetTokenExpires,
    });

    // *** Envio de e-mail ***
    const resetLink = `${req.protocol}://${req.get(
      "host"
    )}/reset-password/${encodeURIComponent(token)}`;

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: utilizador.email,
      subject: "SoftSkills - Link para fazer reset á palavra-passe",
      html: `
        <p>Você solicitou a redefinição da sua palavra-passe.</p>
        <p>Clique no link abaixo para criar uma palavra-passe:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link é válido por 10 minutos.</p>
        <p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message:
        "Um link para resetar a sua senha foi enviado para o seu e-mail.",
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no login.", details: error.message });
  }
};

controllers.resetPassword = async (req, res) => {
  try {
    const token = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const utilizador = await Utilizador.findOne({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!utilizador) {
      return res.status(400).json({ message: "Token é inválido ou expirou!" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    utilizador.password = hashedPassword;
    utilizador.passwordResetToken = null;
    utilizador.passwordResetTokenExpires = null;

    await utilizador.save();

    res.status(200).json({
      success: true,
      message: "Palavra-passe redefinida com sucesso.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao redefinir palavra-passe.",
      details: error.message,
    });
  }
};

controllers.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "As passwords atual e nova são obrigatórias." });
    }

    const utilizador = req.utilizador; // <-- aqui está a diferença!

    const isMatch = await bcrypt.compare(currentPassword, utilizador.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password atual incorreta." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    utilizador.password = hashedPassword;
    utilizador.passwordResetToken = null;
    utilizador.passwordResetTokenExpires = null;
    utilizador.mustChangePassword = false;

    await utilizador.save();

    res
      .status(200)
      .json({ success: true, message: "Password atualizada com sucesso" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erro ao redefinir palavra-passe.",
        details: error.message,
      });
  }
};

module.exports = controllers;
