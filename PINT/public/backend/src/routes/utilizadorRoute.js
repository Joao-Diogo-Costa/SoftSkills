const express = require("express");
const router = express.Router();

const utilizadorController = require("../controllers/utilizadorController");

// GET: Listar todos os utilizadores
router.get("/list", utilizadorController.utilizador_list);

// GET: Detalhes de um utilizador pelo ID
router.get("/get/:id", utilizadorController.utilizador_detail);

// POST: Criar novo utilizador
router.post("/create", utilizadorController.utilizador_create);

// PUT: Atualizar um utilizador existente
router.put("/update/:id", utilizadorController.utilizador_update);

// DELETE: Apagar um utilizador
router.delete("/delete/:id", utilizadorController.utilizador_delete);

module.exports = router;