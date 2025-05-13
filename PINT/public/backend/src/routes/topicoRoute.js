const express = require("express");
const router = express.Router();

const topicoController = require("../controllers/topicoController");

// GET: Listar todos os tópicos
router.get("/list", topicoController.topico_list);

// GET: Detalhar um tópico por ID
router.get("/get/:id", topicoController.topico_detail);

// POST: Criar novo tópico
router.post("/create", topicoController.topico_create);

// PUT: Atualizar um tópico existente
router.put("/update/:id", topicoController.topico_update);

// DELETE: Remover tópico
router.delete("/delete/:id", topicoController.topico_delete);

module.exports = router;
