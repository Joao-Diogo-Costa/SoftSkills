const express = require("express");
const router = express.Router();

const sugestaoForumController = require("../controllers/sugestaoForumController");

// GET: Listar todas as sugestões
router.get("/list", sugestaoForumController.sugestao_list);

// GET: Detalhar uma sugestão por ID
router.get("/get/:id", sugestaoForumController.sugestao_detail);

// POST: Criar nova sugestão
router.post("/create",sugestaoForumController.sugestao_create);

// PUT: Atualizar uma sugestão existente
router.put("/update/:id", sugestaoForumController.sugestao_update);

// DELETE: Remover sugestão
router.delete("/delete/:id", sugestaoForumController.sugestao_delete);

module.exports = router;
