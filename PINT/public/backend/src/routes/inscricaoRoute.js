const express = require("express");
const router = express.Router();

const inscricaoController = require("../controllers/inscricaoController");

// GET: Listar todas as inscrições
router.get("/list", inscricaoController.inscricao_list);

// GET: Detalhar uma inscrição por ID
router.get("/get/:id", inscricaoController.inscricao_detail);

// POST: Criar uma nova inscrição com cursos
router.post("/create", inscricaoController.inscricao_create);

// PUT: Atualizar uma inscrição existente
router.put("/update/:id", inscricaoController.inscricao_update);

// DELETE: Apagar uma inscrição
router.delete("/delete/:id", inscricaoController.inscricao_delete);

module.exports = router;
