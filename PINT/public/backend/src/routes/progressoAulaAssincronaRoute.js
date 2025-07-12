const express = require("express");
const router = express.Router();

// Importar o controlador de progresso
const progressoAulaAssincronaController = require("../controllers/progressoAulaAssincronaController"); 

// Importar o middleware de autenticação
const middleware = require("../middlewares/middleware");

// POST para marcar uma aula como concluída
router.post("/marcar-aula-concluida/:aulaAssincronaId", middleware.checkToken, progressoAulaAssincronaController.marcarAulaConcluida);

// GET progresso do utilizador num curso (percentagem)
router.get("/progresso/:utilizadorId/:cursoId", middleware.checkToken, progressoAulaAssincronaController.getProgressoCurso);

// GET listar todas as aulas concluídas por utilizador num curso
router.get("/concluidas/:utilizadorId/:cursoId", middleware.checkToken, progressoAulaAssincronaController.listarAulasConcluidas);

// GET verificar se aula está concluída
router.get("/concluida/:utilizadorId/:aulaAssincronaId", middleware.checkToken, progressoAulaAssincronaController.aulaEstaConcluida);

module.exports = router;