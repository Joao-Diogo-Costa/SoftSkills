const express = require("express");
const router = express.Router();

const sugestaoController = require("../controllers/sugestaoController");

// GET: Listar todas as sugestões
router.get("/list", sugestaoController.sugestao_list);

// GET: Detalhar uma sugestão por ID
router.get("/get/:id", sugestaoController.sugestao_detail);

// POST: Criar nova sugestão
router.post("/create", sugestaoController.sugestao_create);

// PUT: Atualizar uma sugestão existente
router.put("/update/:id", sugestaoController.sugestao_update);

// DELETE: Remover sugestão
router.delete("/delete/:id", sugestaoController.sugestao_delete);

module.exports = router;
