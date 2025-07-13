const express = require("express");
const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoComentarioController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as avaliações (likes) de comentários
router.get("/list", avaliacaoController.avaliacao_list);

// GET: Total de likes de um comentário
router.get("/total/:comentarioId", avaliacaoController.total_likes);

// POST: Criar um like (avaliação) para um comentário
router.post("/create", middleware.checkToken, avaliacaoController.avaliacao_create);

// DELETE: Remover um like (avaliação) de um comentário
router.delete("/delete/:id", middleware.checkToken, avaliacaoController.avaliacao_delete);

module.exports = router;