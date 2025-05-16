const express = require("express");
const router = express.Router();

const sugestaoTopicoController = require("../controllers/sugestaoTopicoController");

// GET: Listar todas as sugestões
router.get("/list", sugestaoTopicoController.sugestao_list);

// GET: Detalhar uma sugestão por ID
router.get("/get/:id", sugestaoTopicoController.sugestao_detail);

// POST: Criar nova sugestão
router.post("/create", sugestaoTopicoController.sugestao_create);

// PUT: Atualizar uma sugestão existente
router.put("/update/:id", sugestaoTopicoController.sugestao_update);

// DELETE: Remover sugestão
router.delete("/delete/:id", sugestaoTopicoController.sugestao_delete);

module.exports = router;
