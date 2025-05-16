const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");

// GET: Listar todos os cursos
router.get("/list", cursoController.curso_list);

// GET: Detalhar um curso por ID
router.get("/get/:id", cursoController.curso_detail);

// POST: Criar um novo curso
router.post("/create", cursoController.curso_create);

// PUT: Atualizar um curso existente
router.put("/update/:id", cursoController.curso_update);

// DELETE: Apagar um curso
router.delete("/delete/:id", cursoController.curso_delete);

module.exports = router;