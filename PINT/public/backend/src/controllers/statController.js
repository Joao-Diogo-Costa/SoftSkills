const AreaC = require("../model/AreaC");
const CategoriaC = require("../model/CategoriaC");
const Curso = require("../model/Curso");
const Utilizador = require("../model/Utilizador");

const controllers = {};

controllers.estatisticaController = async (req, res) =>{
  try {
    const totalAlunos = await Utilizador.count({ where: { role: 'formando' } });
    const totalFormadores = await Utilizador.count({ where: { role: 'formador' } });
    const totalCursos = await Curso.count();

    res.json({
      totalAlunos,
      totalFormadores,
      totalCursos,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erro ao obter estatísticas', error: error.message });
  }
}

module.exports = controllers;
