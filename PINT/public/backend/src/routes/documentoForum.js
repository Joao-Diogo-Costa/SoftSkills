const express = require("express");
const router = express.Router();

const documentoForumController = require("../controllers/documentoForumController");

// GET: Listar todos os documentos do fórum
router.get("/list", documentoForumController.documento_list);

// GET: Detalhar um documento do fórum por ID
router.get("/get/:id", documentoForumController.documento_detail);

// POST: Criar um novo documento do fórum
router.post("/create", documentoForumController.documento_create);

// PUT: Atualizar um documento do fórum existente
router.put("/update/:id", documentoForumController.documento_update);

// DELETE: Apagar um documento do fórum
router.delete("/delete/:id", documentoForumController.documento_delete);

module.exports = router;
