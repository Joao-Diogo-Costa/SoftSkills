const express = require("express");
const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoForumUtilizadorController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as avaliações de fórum
router.get("/list", avaliacaoController.avaliacao_list);

// GET: Média das notas do fórum
router.get("/media/:forumId", avaliacaoController.media_avaliacao_forum);

// GET: Detalhes de uma avaliação pelo ID
router.get("/get/:id", avaliacaoController.avaliacao_detail);

// POST: Criar uma nova avaliação de fórum
router.post("/create", middleware.checkToken, middleware.authorize(['gestor', 'formando']), avaliacaoController.avaliacao_create);

// PUT: Atualizar uma avaliação de fórum existente
router.put("/update/:id", middleware.checkToken, middleware.authorize(['gestor', 'formando']), avaliacaoController.avaliacao_update);

// DELETE: Apagar uma avaliação de fórum
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor']), avaliacaoController.avaliacao_delete);

module.exports = router;