const express = require("express");
const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoCursoUtilizadorController");

// GET: Listar todas as avaliações
router.get("/list", avaliacaoController.avaliacao_list);

// GET: Detalhes de uma avaliação pelo ID
router.get("/get/:id", avaliacaoController.avaliacao_detail);

// POST: Criar uma nova avaliação
router.post("/create", avaliacaoController.avaliacao_create);

// PUT: Atualizar uma avaliação existente
router.put("/update/:id", avaliacaoController.avaliacao_update);

// DELETE: Apagar uma avaliação
router.delete("/delete/:id", avaliacaoController.avaliacao_delete);

module.exports = router;