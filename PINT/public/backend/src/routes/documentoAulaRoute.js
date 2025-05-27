const express = require("express");
const router = express.Router();

const documentoAulaController = require("../controllers/documentoAulaController");
const middleware = require("../middlewares/middleware");

// GET: Listar todos os documentos de aula
router.get("/list", documentoAulaController.documentoAula_list);

// GET: Detalhar um documento de aula por ID
router.get("/get/:id", documentoAulaController.documentoAula_detail);

// POST: Criar um novo documento de aula
router.post("/create", middleware.checkToken, documentoAulaController.documentoAula_create);

// PUT: Atualizar um documento de aula existente
router.put("/update/:id", middleware.checkToken, documentoAulaController.documentoAula_update);

// DELETE: Apagar um documento de aula
router.delete("/delete/:id", middleware.checkToken, documentoAulaController.documentoAula_delete);

module.exports = router;
