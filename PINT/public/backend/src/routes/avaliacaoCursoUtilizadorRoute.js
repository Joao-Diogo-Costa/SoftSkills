const express = require("express");
const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoCursoUtilizadorController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as avaliações
router.get("/list", avaliacaoController.avaliacao_list);

// GET: Detalhes de uma avaliação pelo ID
router.get("/get/:id", avaliacaoController.avaliacao_detail);

// POST: Criar uma nova avaliação
router.post("/create", middleware.checkToken, avaliacaoController.avaliacao_create);

// PUT: Atualizar uma avaliação existente
router.put("/update/:id", middleware.checkToken, avaliacaoController.avaliacao_update);

// DELETE: Apagar uma avaliação
router.delete("/delete/:id", middleware.checkToken, avaliacaoController.avaliacao_delete);

module.exports = router;