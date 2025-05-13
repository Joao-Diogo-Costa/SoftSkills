const Formando = require("../model/Formando");
const bcrypt = require("bcryptjs");

const authController = {};

// Login
authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email e password são obrigatórios." });
    }

    const formando = await Formando.findOne({ where: { email } });

    if (!formando) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const senhaValida = await bcrypt.compare(password, formando.password);

    if (!senhaValida) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    // Em produção, aqui normalmente gerarias um JWT ou sessão
    res.json({
      success: true,
      message: "Login bem-sucedido.",
      data: {
        id: formando.id,
        nome: formando.nomeFormando,
        email: formando.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Erro no login.", error: error.message });
  }
};

module.exports = authController;