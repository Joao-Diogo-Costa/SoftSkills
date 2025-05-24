const express = require("express");
const router = express.Router();

const comentarioController = require("../controllers/comentarioController");

// GET: Listar todos os comentários
router.get("/list", comentarioController.comentario_list);

// GET: Detalhar um comentário pelo ID
router.get("/get/:id", comentarioController.comentario_detail);

// POST: Criar novo comentário
router.post("/create", comentarioController.comentario_create);

// PUT: Atualizar um comentário existente
router.put("/update/:id", comentarioController.comentario_update);

// DELETE: Apagar um comentário
router.delete("/delete/:id", comentarioController.comentario_delete);

module.exports = router;
