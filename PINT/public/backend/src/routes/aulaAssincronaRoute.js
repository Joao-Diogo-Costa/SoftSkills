const express = require("express");
const router = express.Router();
const aulaAssincronaController = require("../controllers/aulaAssincronaController");

// Listar todas as aulas assíncronas
router.get("/list", aulaAssincronaController.aulaAssincrona_list);

// Obter detalhe de uma aula assíncrona por ID
router.get("/get/:id", aulaAssincronaController.aulaAssincrona_detail);

// Criar uma nova aula assíncrona
router.post("/create", aulaAssincronaController.aulaAssincrona_create);

// Atualizar uma aula assíncrona existente
router.put("/update/:id", aulaAssincronaController.aulaAssincrona_update);

// Apagar uma aula assíncrona
router.delete("/delete/:id", aulaAssincronaController.aulaAssincrona_delete);

// Aulas asssincrona por curso
router.get("/curso/:cursoId", aulaAssincronaController.aulaAssincrona_listByCurso);

module.exports = router;
