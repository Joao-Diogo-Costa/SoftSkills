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
    const { nomeUtilizador, dataNasc, nTel, email, role } = req.body;

    if (!nomeUtilizador || !dataNasc || !nTel || !email) {
      return res
        .status(400)
        .json({
          message:
            "Nome, data de nascimento, telefone e email são obrigatórios.",
        });
    }

    const utilizadorExistente = await Utilizador.findOne({ where: { email } });
    if (utilizadorExistente) {
      return res.status(409).json({ message: "Este email já está registado." });
    }

    const hashTemporaria = await bcrypt.hash("pendente", 10);

    const utilizador = await Utilizador.create({
      nomeUtilizador,
      dataNasc,
      nTel,
      email,
      password: hashTemporaria,
      role: "formando",
      mustChangePassword: true,
      imagemPerfil:
        "https://pint-2025.s3.eu-north-1.amazonaws.com/imagem-perfil/default_profile_pic.jpg",
      pontos: 0,
      dataRegisto: new Date(),
      aprovado: false,
    });

    res
      .status(201)
      .json({
        success: true,
        message:
          "Utilizador registado com sucesso. Os dados serão enviados por e-mail após aprovação.",
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erro ao registar utilizador.",
        details: error.message,
      });
  }
};

controllers.aprovarUtilizador = async (req, res) => {
  try {
    const { id } = req.params;

    const utilizador = await Utilizador.findByPk(id);

    if (!utilizador) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    if (utilizador.aprovado) {
      return res.status(400).json({ message: "Utilizador já aprovado." });
    }

    const novaPassword = crypto.randomBytes(6).toString("hex");
    const hashedPassword = await bcrypt.hash(novaPassword, 10);

    utilizador.aprovado = true;
    utilizador.password = hashedPassword;
    utilizador.mustChangePassword = true;

    await utilizador.save();

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
      subject: "Bem-vindo à plataforma SoftSkills!",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background: #f6f8fa; padding: 32px;">
          <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e0e7ef; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://pint-2025.s3.eu-north-1.amazonaws.com/softskills_logo.png" alt="SoftSkills" style="height: 60px; margin-bottom: 8px;" />
            </div>
            <h3 style="color: #39639D;">Bem-vindo(a), ${
              utilizador.nomeUtilizador
            }!</h3>
            <p style="color: #333;">O seu registo na plataforma <strong>SoftSkills</strong> foi aprovado com sucesso.</p>
            <p style="color: #333;">Segue abaixo os seus dados de acesso:</p>
            <table style="width: 100%; margin: 16px 0 24px 0; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #294873;"><strong>Nome de utilizador:</strong></td>
                <td style="padding: 8px 0;">${utilizador.nomeUtilizador}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #294873;"><strong>Email:</strong></td>
                <td style="padding: 8px 0;">${utilizador.email}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #294873;"><strong>Password:</strong></td>
                <td style="padding: 8px 0;">${novaPassword}</td>
              </tr>
            </table>
            <p style="color: #c0392b;"><strong>Por razões de segurança, vai ter de alterar a sua palavra-passe após o primeiro login.</strong></p>
            <p style="color: #333;">Se tiver alguma dúvida, contacte o suporte através do email <a href="mailto:support@softskills.com" style="color: #39639D;">support@softskills.com</a>.</p>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0e7ef;" />
            <p style="font-size: 13px; color: #888; text-align: center;">
              &copy; ${new Date().getFullYear()} SoftSkills. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ success: true, message: "Utilizador aprovado com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao aprovar utilizador.", details: error.message });
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

    if (!utilizador.aprovado) {
      return res
        .status(403)
        .json({
          message: "A sua conta ainda não foi aprovada pelo administrador.",
        });
    }

    const passValida = await bcrypt.compare(password, utilizador.password);

    if (!passValida) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const { password: _, ...utilizadorSemPassword } = utilizador.toJSON();

    if (utilizador.mustChangePassword) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Primeiro login - alteração de palavra-passe necessária.",
          mustChangePassword: true,
          data: utilizadorSemPassword,
        });
    }

    const token = signToken(utilizador.id);

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
    // isto para localhost
    const resetLink = `https://softskills-demo.vercel.app/reset-password/${encodeURIComponent(
      token
    )}`;

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
      subject: "SoftSkills - Redefinição de palavra-passe",
      html: `
        <div style="font-family: Arial, Helvetica, sans-serif; background: #f6f8fa; padding: 32px;">
          <div style="max-width: 520px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px #e0e7ef; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <img src="https://pint-2025.s3.eu-north-1.amazonaws.com/softskills_logo.png" alt="SoftSkills" style="height: 60px; margin-bottom: 8px;" />
            </div>
            <h3 style="color: #39639D;">Pedido de redefinição de palavra-passe</h3>
            <p style="color: #333;">Recebemos um pedido para redefinir a sua palavra-passe na plataforma <strong>SoftSkills</strong>.</p>
            <p style="color: #333;">Para criar uma nova palavra-passe, clique no botão abaixo:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${resetLink}" style="background: #39639D; color: #fff; padding: 12px 28px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">
                Redefinir palavra-passe
              </a>
            </div>
            <p style="color: #333;">Ou copie e cole este link no seu navegador:</p>
            <p style="word-break: break-all; color: #39639D;">${resetLink}</p>
            <p style="color: #c0392b;"><strong>Este link é válido por 10 minutos.</strong></p>
            <p style="color: #888;">Se não solicitou esta redefinição, ignore este e-mail. A sua palavra-passe permanecerá inalterada.</p>
            <hr style="margin: 32px 0; border: none; border-top: 1px solid #e0e7ef;" />
            <p style="font-size: 13px; color: #888; text-align: center;">
              &copy; ${new Date().getFullYear()} SoftSkills. Todos os direitos reservados.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(200)
      .json({
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

    res
      .status(200)
      .json({
        success: true,
        message: "Palavra-passe redefinida com sucesso.",
      });
  } catch (error) {
    res
      .status(500)
      .json({
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

    const utilizador = req.utilizador;

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

controllers.forceUpdatePassword = async (req, res) => {
  try {
    const { email, newPassword, confirmNewPassword } = req.body;

    if (!email || !newPassword || !confirmNewPassword) {
      return res
        .status(400)
        .json({
          message: "Email, nova palavra-passe e confirmação são obrigatórios.",
        });
    }

    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({
          message: "A nova palavra-passe deve ter pelo menos 8 caracteres.",
        });
    }

    if (newPassword !== confirmNewPassword) {
      return res
        .status(400)
        .json({
          message: "A nova palavra-passe e a confirmação não coincidem.",
        });
    }

    const utilizador = await Utilizador.findOne({ where: { email } });

    if (!utilizador) {
      return res.status(404).json({ message: "Utilizador não encontrado." });
    }

    if (!utilizador.mustChangePassword) {
      return res
        .status(403)
        .json({
          message:
            "Não é necessário alterar a palavra-passe. Por favor, use a rota de login normal.",
        });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await utilizador.update({
      password: hashedPassword,
      mustChangePassword: false,
      passwordResetToken: null,
      passwordResetTokenExpires: null,
    });

    const token = signToken(utilizador.id);
    const { password: _, ...utilizadorSemPassword } = utilizador.toJSON();

    res.json({
      success: true,
      message: "Palavra-passe alterada com sucesso. Login efetuado.",
      token,
      data: utilizadorSemPassword,
    });
  } catch (error) {
    console.error("Erro ao forçar atualização de palavra-passe:", error);
    res
      .status(500)
      .json({
        message: "Erro ao forçar atualização de palavra-passe.",
        details: error.message,
      });
  }
};

module.exports = controllers;
