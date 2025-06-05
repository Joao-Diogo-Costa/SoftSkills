const express = require("express");
const router = express.Router();

const certificadoController = require("../controllers/certificadoController");
const middleware = require("../middlewares/middleware");

// GET: Listar todos os certificados
router.get("/list", certificadoController.certificado_list);

// GET: Detalhar um certificado pelo ID
router.get("/get/:id", certificadoController.certificado_detail);

// POST: Criar novo certificado
router.post("/create", middleware.checkToken, certificadoController.certificado_create);

// PUT: Atualizar um certificado existente
router.put("/update/:id", middleware.checkToken, certificadoController.certificado_update);

// DELETE: Apagar um certificado
router.delete("/delete/:id", middleware.checkToken, certificadoController.certificado_delete);

router.get('/download/:inscricaoId', middleware.checkToken, certificadoController.gerarCertificado);


module.exports = router;
