const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");
const middleware = require("../middlewares/middleware");

// GET: Listar todos os cursos
router.get("/list", cursoController.curso_list);

// GET: Detalhar um curso por ID
router.get("/get/:id", cursoController.curso_detail);

// POST: Criar um novo curso
router.post("/create", middleware.checkToken, cursoController.curso_create);

// PUT: Atualizar um curso existente
router.put("/update/:id", middleware.checkToken, cursoController.curso_update);

// DELETE: Apagar um curso
router.delete("/delete/:id", middleware.checkToken, cursoController.curso_delete);

// GET Cursos por categoria
router.get("/categoria/:idCategoria", cursoController.listarCursosPorCategoria);

//GET curso por Area
router.get("/area/:idArea", cursoController.listarCursosPorArea);

module.exports = router;