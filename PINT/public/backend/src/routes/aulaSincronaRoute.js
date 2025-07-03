const express = require("express");
const router = express.Router();

const aulaSincronaController = require("../controllers/aulaSincronaController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as aulas síncronas
router.get("/list", aulaSincronaController.aulaSincrona_list);

// GET: Detalhes de uma aula síncrona pelo ID
router.get("/get/:id", aulaSincronaController.aulaSincrona_detail);

// POST: Criar nova aula síncrona
router.post("/create", middleware.checkToken, middleware.authorize(['gestor', 'formador']), aulaSincronaController.aulaSincrona_create);

// PUT: Atualizar aula síncrona existente
router.put("/update/:id", middleware.checkToken, middleware.authorize(['gestor', 'formador']), aulaSincronaController.aulaSincrona_update);

// DELETE: Apagar aula síncrona
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor', 'formador']), aulaSincronaController.aulaSincrona_delete);

// Aulas sincrona por curso
router.get("/curso/:cursoId", aulaSincronaController.aulaSincrona_listByCurso);

module.exports = router;