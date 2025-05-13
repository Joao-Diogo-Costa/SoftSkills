const express = require("express");
const router = express.Router();

const formadorController = require("../controllers/formadorController");

// GET: Listar todos os formadores
router.get("/list", formadorController.formador_list);

// GET: Detalhar um formador por ID
router.get("/get/:id", formadorController.formador_detail);

// POST: Criar um novo formador
router.post("/create", formadorController.formador_create);

// PUT: Atualizar um formador existente
router.put("/update/:id", formadorController.formador_update);

// DELETE: Apagar um formador
router.delete("/delete/:id", formadorController.formador_delete);

module.exports = router;
