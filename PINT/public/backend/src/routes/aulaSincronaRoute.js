const express = require("express");
const router = express.Router();

const aulaSincronaController = require("../controllers/aulaSincronaController");

// GET: Listar todas as aulas síncronas
router.get("/list", aulaSincronaController.AulaSincrona_list);

// GET: Detalhes de uma aula síncrona pelo ID
router.get("/get/:id", aulaSincronaController.AulaSincrona_detail);

// POST: Criar nova aula síncrona
router.post("/create", aulaSincronaController.AulaSincrona_create);

// PUT: Atualizar aula síncrona existente
router.put("/update/:id", aulaSincronaController.AulaSincrona_update);

// DELETE: Apagar aula síncrona
router.delete("/delete/:id", aulaSincronaController.AulaSincrona_delete);

module.exports = router;