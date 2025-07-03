const express = require("express");
const router = express.Router();

const denunciaController = require("../controllers/denunciaController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as denúncias
router.get("/list", denunciaController.denuncia_list);

// GET: Listar o utilizador mais denunciado
router.get("/utilizador-mais-denunciado", denunciaController.utilizador_mais_denunciado);

// GET: Detalhar uma denúncia por ID
router.get("/get/:id", denunciaController.denuncia_detail);

// POST: Criar uma nova denúncia
router.post("/create", middleware.checkToken, denunciaController.denuncia_create);

// PUT: Atualizar uma denúncia existente
router.put("/update/:id", middleware.checkToken, denunciaController.denuncia_update);

// DELETE: Apagar uma denúncia
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor']), denunciaController.denuncia_delete);

module.exports = router;
