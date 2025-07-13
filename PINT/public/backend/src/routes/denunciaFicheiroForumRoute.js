const express = require("express");
const router = express.Router();

const denunciaController = require("../controllers/denunciaFicheiroForumController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as denúncias de ficheiros do fórum
router.get("/list", denunciaController.denuncia_list);

// GET: Detalhes de uma denúncia pelo ID
router.get("/get/:id", denunciaController.denuncia_detail);

// POST: Criar uma nova denúncia de ficheiro do fórum
router.post("/create", middleware.checkToken, denunciaController.denuncia_create);

// PUT: Atualizar uma denúncia existente
router.put("/update/:id", middleware.checkToken, denunciaController.denuncia_update);

// DELETE: Apagar uma denúncia
router.delete("/delete/:id", middleware.checkToken, denunciaController.denuncia_delete);

module.exports = router;