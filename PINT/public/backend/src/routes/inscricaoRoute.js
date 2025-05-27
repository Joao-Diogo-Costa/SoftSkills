const express = require("express");
const router = express.Router();

const inscricaoController = require("../controllers/inscricaoController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as inscrições
router.get("/list", inscricaoController.inscricao_list);

// GET: Detalhar uma inscrição por ID
router.get("/get/:id", inscricaoController.inscricao_detail);

// POST: Criar uma nova inscrição com cursos
router.post("/create", middleware.checkToken, inscricaoController.inscricao_create);

// PUT: Atualizar uma inscrição existente
router.put("/update/:id", middleware.checkToken, inscricaoController.inscricao_update);

// DELETE: Apagar uma inscrição
router.delete("/delete/:id", middleware.checkToken, inscricaoController.inscricao_delete);

// inscricao por utilizador
router.get("/utilizador/:utilizadorId", inscricaoController.inscricao_list_user)

module.exports = router;
