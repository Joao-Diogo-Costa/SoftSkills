const express = require("express");
const router = express.Router();

const conteudoController = require("../controllers/conteudoController");

// GET: Listar todos os conteúdos
router.get("/list", conteudoController.conteudo_list);

// GET: Detalhar um conteúdo pelo ID
router.get("/get/:id", conteudoController.conteudo_detail);

// POST: Criar novo conteúdo
router.post("/create", conteudoController.conteudo_create);

// PUT: Atualizar um conteúdo existente
router.put("/update/:id", conteudoController.conteudo_update);

// DELETE: Apagar um conteúdo
router.delete("/delete/:id", conteudoController.conteudo_delete);

module.exports = router;
