const Utilizador = require("../model/Utilizador");
const bcrypt = require("bcryptjs");

const authController = {};

// Login
authController.login = async (req, res) => {
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

module.exports = authController;