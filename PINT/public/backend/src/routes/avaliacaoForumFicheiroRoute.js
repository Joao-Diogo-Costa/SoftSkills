const express = require("express");
const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoForumFicheiroController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as avaliações de ficheiros do fórum
router.get("/list", avaliacaoController.avaliacao_list);

// GET: Média das notas de um ficheiro do fórum
router.get("/media/:forumFicheiroId", avaliacaoController.media_avaliacao_ficheiro);

// GET: Detalhes de uma avaliação pelo ID
router.get("/get/:id", avaliacaoController.avaliacao_detail);

// POST: Criar uma nova avaliação de ficheiro do fórum
router.post("/create", middleware.checkToken, middleware.authorize(['gestor', 'formando']), avaliacaoController.avaliacao_create);

// PUT: Atualizar uma avaliação de ficheiro do fórum existente
router.put("/update/:id", middleware.checkToken, middleware.authorize(['gestor', 'formando']), avaliacaoController.avaliacao_update);

// DELETE: Apagar uma avaliação de ficheiro do fórum
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor']), avaliacaoController.avaliacao_delete);

module.exports = router;