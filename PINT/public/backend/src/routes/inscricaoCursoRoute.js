const express = require("express");
const router = express.Router();

const inscricaoCursoController = require("../controllers/inscricaoCursoController");

// GET: Listar todas as inscrições de cursos
router.get("/list", inscricaoCursoController.inscricao_list);

// GET: Detalhar inscrição específica por inscriçãoId e cursoId
router.get("/get/:inscricaoId/:cursoId", inscricaoCursoController.inscricao_detail);

// POST: Criar nova inscrição em um curso
router.post("/create", inscricaoCursoController.inscricao_create);

// DELETE: Remover inscrição de um curso
router.delete("/delete/:inscricaoId/:cursoId", inscricaoCursoController.inscricao_delete);

module.exports = router;
