const express = require("express");
const router = express.Router();

const documentoAulaController = require("../controllers/documentoAulaController");

// GET: Listar todos os documentos de aula
router.get("/list", documentoAulaController.documentoAula_list);

// GET: Detalhar um documento de aula por ID
router.get("/get/:id", documentoAulaController.documentoAula_detail);

// POST: Criar um novo documento de aula
router.post("/create", documentoAulaController.documentoAula_create);

// PUT: Atualizar um documento de aula existente
router.put("/update/:id", documentoAulaController.documentoAula_update);

// DELETE: Apagar um documento de aula
router.delete("/delete/:id", documentoAulaController.documentoAula_delete);

module.exports = router;
