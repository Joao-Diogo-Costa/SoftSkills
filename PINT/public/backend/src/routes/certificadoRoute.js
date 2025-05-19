const express = require("express");
const router = express.Router();

const certificadoController = require("../controllers/certificadoController");

// GET: Listar todos os certificados
router.get("/list", certificadoController.certificado_list);

// GET: Detalhar um certificado pelo ID
router.get("/get/:id", certificadoController.certificado_detail);

// POST: Criar novo certificado
router.post("/create", certificadoController.certificado_create);

// PUT: Atualizar um certificado existente
router.put("/update/:id", certificadoController.certificado_update);

// DELETE: Apagar um certificado
router.delete("/delete/:id", certificadoController.certificado_delete);

module.exports = router;
