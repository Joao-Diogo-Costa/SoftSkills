const express = require("express");
const router = express.Router();

const denunciaController = require("../controllers/denunciaController");

// GET: Listar todas as denúncias
router.get("/list", denunciaController.denuncia_list);

// GET: Detalhar uma denúncia por ID
router.get("/get/:id", denunciaController.denuncia_detail);

// POST: Criar uma nova denúncia
router.post("/create", denunciaController.denuncia_create);

// PUT: Atualizar uma denúncia existente
router.put("/update/:id", denunciaController.denuncia_update);

// DELETE: Apagar uma denúncia
router.delete("/delete/:id", denunciaController.denuncia_delete);

module.exports = router;
