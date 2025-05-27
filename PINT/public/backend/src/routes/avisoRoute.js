const express = require("express");
const router = express.Router();

const avisoController = require("../controllers/avisoCursoController");
const middleware = require("../middlewares/middleware");

// GET: Listar todos os avisos
router.get("/list", avisoController.aviso_list);

// GET: Detalhes de um aviso pelo ID
router.get("/get/:id", avisoController.aviso_detail);

// POST: Criar novo aviso
router.post("/create", middleware.checkToken, avisoController.aviso_create);

// PUT: Atualizar um aviso existente
router.put("/update/:id", middleware.checkToken, avisoController.aviso_update);

// DELETE: Apagar um aviso
router.delete("/delete/:id", middleware.checkToken, avisoController.aviso_delete);

module.exports = router;