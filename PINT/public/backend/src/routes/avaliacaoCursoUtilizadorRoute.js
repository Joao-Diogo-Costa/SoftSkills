const express = require("express");
const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoCursoUtilizadorController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as avaliações
router.get("/list", avaliacaoController.avaliacao_list);

//GET : média das notas
router.get("/media/:cursoId", avaliacaoController.media_avaliacao_curso);

// GET: Detalhes de uma avaliação pelo ID
router.get("/get/:id", avaliacaoController.avaliacao_detail);

// POST: Criar uma nova avaliação
router.post("/create", middleware.checkToken, middleware.authorize(['gestor', 'formando']), avaliacaoController.avaliacao_create);

// PUT: Atualizar uma avaliação existente
router.put("/update/:id", middleware.checkToken, middleware.authorize(['gestor', 'formando']), avaliacaoController.avaliacao_update);

// DELETE: Apagar uma avaliação
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor']), avaliacaoController.avaliacao_delete);

module.exports = router;
