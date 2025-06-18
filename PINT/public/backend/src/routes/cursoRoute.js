const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// GET: Listar todos os cursos
router.get("/list", cursoController.curso_list);

// GET: Detail curso por ID
router.get("/get/:id", cursoController.curso_detail);

// POST: Criar um novo curso
router.post("/create", middleware.checkToken, cursoController.curso_create);

// PUT: Atualizar curso 
router.put("/update/:id", middleware.checkToken, cursoController.curso_update);

// POST: Renovar curso
router.post('/:id/renovar', middleware.checkToken, cursoController.curso_renew);

// DELETE: Apagar um curso
router.delete("/delete/:id", middleware.checkToken, cursoController.curso_delete);

// GET Cursos por categoria
router.get("/categoria/:idCategoria", cursoController.listarCursosPorCategoria);

//GET curso por Area
router.get("/area/:idArea", cursoController.listarCursosPorArea);

// Upload imagem banner curso
router.post("/upload-imagem-banner/:id", middleware.checkToken , upload.single("imagem-banner"), cursoController.uploadImagemCurso );

module.exports = router;