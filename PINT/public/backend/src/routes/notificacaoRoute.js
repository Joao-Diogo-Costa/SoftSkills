const express = require("express");
const router = express.Router();

const notificacaoController = require("../controllers/notificacaoController");

// GET: Listar todas as notificações
router.get("/list", notificacaoController.notificacao_list);

// GET: Detalhar uma notificação por ID
router.get("/get/:id", notificacaoController.notificacao_detail);

// POST: Criar nova notificação
router.post("/create", notificacaoController.notificacao_create);

// PUT: Atualizar uma notificação existente
router.put("/update/:id", notificacaoController.notificacao_update);

// DELETE: Remover notificação
router.delete("/delete/:id", notificacaoController.notificacao_delete);

module.exports = router;
