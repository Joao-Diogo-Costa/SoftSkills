const express = require("express");
const router = express.Router();

const formandoController = require("../controllers/formandoController");

// GET: Listar todos os formandos
router.get("/list", formandoController.formando_list);

// GET: Detalhar um formando por ID
router.get("/get/:id", formandoController.formando_detail);

// POST: Criar um novo formando
router.post("/create", formandoController.formando_create);

// PUT: Atualizar um formando existente
router.put("/update/:id", formandoController.formando_update);

// DELETE: Apagar um formando
router.delete("/delete/:id", formandoController.formando_delete);

module.exports = router;
