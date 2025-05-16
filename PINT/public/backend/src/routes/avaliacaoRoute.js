const express = require("express");
const router = express.Router();

const avaliacaoController = require("../controllers/avaliacaoController");

// GET: Listar todas as avaliações
router.get("/list", avaliacaoController.Avaliacao_list);

// GET: Detalhes de uma avaliação pelo ID
router.get("/get/:id", avaliacaoController.Avaliacao_detail);

// POST: Criar uma nova avaliação
router.post("/create", avaliacaoController.Avaliacao_create);

// PUT: Atualizar uma avaliação existente
router.put("/update/:id", avaliacaoController.Avaliacao_update);

// DELETE: Apagar uma avaliação
router.delete("/delete/:id", avaliacaoController.Avaliacao_delete);

module.exports = router;