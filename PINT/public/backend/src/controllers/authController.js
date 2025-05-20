const Utilizador = require("../model/Utilizador");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const controllers = {};

// Login
controllers.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e password são obrigatórios." });
    }

    const utilizador = await Utilizador.findOne({ where: { email } });

    if (!utilizador) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const passValida = await bcrypt.compare(password, utilizador.password);

    if (!passValida) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Em produção, aqui normalmente gerarias um JWT ou sessão
    res.json({
      success: true,
      message: "Login bem-sucedido.",
      data: {
        id: utilizador.id,
        nome: utilizador.nomeUtilizador,
        email: utilizador.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no login.", details: error.message });
  }
};

const createResetPasswordToken = () => {

    const resetToken = crypto.randomBytes(32).toString('hex');

    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    return {token: resetToken, hashedToken};

}

controllers.forgotPassword = async( req, res) => {
  try {
    const {email} = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email é obrigatório." });
    }

    const utilizador = await Utilizador.findOne({ where: { email } });

    if (!utilizador) {
      return res.status(401).json({ message: "Este e-mail não existe" });
    }

    const { token , hashedToken } = createResetPasswordToken();
    const passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutos

    await utilizador.update({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: passwordResetTokenExpires,
    });

    // *** Envio de e-mail ***
    const resetLink = `${req.protocol}://${req.get('host')}/reset-password/${token}`;

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
      subject: 'SoftSkills - Link para fazer reset á palavra-passe',
      html: `
        <p>Você solicitou a redefinição da sua palavra-passe.</p>
        <p>Clique no link abaixo para criar uma palavra-passe:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Este link é válido por 10 minutos.</p>
        <p>Se você não solicitou esta redefinição, ignore este e-mail.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Um link para resetar a sua senha foi enviado para o seu e-mail." });

    
  } catch (error) {
    res.status(500).json({ message: "Erro no login.", details: error.message });
  }
}


controllers.resetPassword = async( req, res, next) => {

  try {


    
  } catch (error) {
    res.status(500).json({ message: "Erro no login.", details: error.message });
  }
}

module.exports = controllers;