const express = require("express");
const router = express.Router();

const cursoController = require("../controllers/cursoController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// GET: Listar todos os cursos
router.get("/list", cursoController.curso_list);

// GET: Listar cursos do formador 
router.get("/list-formador", middleware.checkToken, cursoController.listarCursosPorFormador);

// GET: Listar cursos por formadorId
router.get("/formador/:id", cursoController.listarCursosPorIdFormador);

// GET: Listar notas tarefa
router.get("/:cursoId/utilizador/:utilizadorId/notas-tarefas", middleware.checkToken, cursoController.notasTarefasPorUtilizador);

// GET: Listar conteudo do curso
router.get("/:cursoId/conteudo", middleware.checkToken, cursoController.listarConteudosPorCurso);

// GET: Listar tarefas do curso
router.get("/:cursoId/tarefa", middleware.checkToken, cursoController.listarTarefasPorCurso);

// GET: Listar avisos do curso 
router.get("/:cursoId/aviso", middleware.checkToken, cursoController.listarAvisosPorCurso);

// GET: Detail curso por ID
router.get("/get/:id", cursoController.curso_detail);

// GET: Curso mais popular do mes
router.get("/mais-popular-mes", cursoController.curso_mais_popular_mes);

// POST: Criar um novo curso
router.post("/create", middleware.checkToken, middleware.authorize(['gestor']), cursoController.curso_create);

// PUT: Atualizar curso 
router.put("/update/:id", middleware.checkToken, middleware.authorize(['gestor']), cursoController.curso_update);

// POST: Renovar curso
router.post('/:id/renovar', middleware.checkToken, middleware.authorize(['gestor']), cursoController.curso_renew);

// DELETE: Apagar um curso
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor']), cursoController.curso_delete);

// GET Cursos por categoria
router.get("/categoria/:idCategoria", cursoController.listarCursosPorCategoria);

//GET curso por Area
router.get("/area/:idArea", cursoController.listarCursosPorArea);

// Upload imagem banner curso
router.post("/upload-imagem-banner/:id", middleware.checkToken , middleware.authorize(['gestor']), upload.single("imagem-banner"), cursoController.uploadImagemCurso );

module.exports = router;