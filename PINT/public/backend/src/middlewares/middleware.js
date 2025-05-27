const jwt = require("jsonwebtoken");
const Utilizador = require("../model/Utilizador");

require("dotenv").config();

let checkToken = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers["authorization"];

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "O token não é válido.",
        });
      } else {
        try {
          const utilizador = await Utilizador.findByPk(decoded.id);
          if (!utilizador) {
            return res.status(404).json({ success: false, message: "Utilizador não encontrado." });
          }

          req.utilizador = utilizador; 
          next();
        } catch (dbError) {
          return res.status(500).json({ success: false, message: "Erro ao verificar utilizador.", details: dbError.message });
        }
      }
    });
  } else {
    return res.status(403).json({
      success: false,
      message: "Token indisponível.",
    });
  }
};


function authorize(perfisPermitidos) {
  return (req, res, next) => {
    if (!perfisPermitidos.includes(req.utilizador.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
}

module.exports = {
  checkToken,
  authorize,
};