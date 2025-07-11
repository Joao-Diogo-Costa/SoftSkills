const express = require("express");
const router = express.Router();

const utilizadorController = require("../controllers/utilizadorController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// GET: Listar todos os utilizadores
router.get("/list", utilizadorController.utilizador_list);

// GET: Detalhes de um utilizador pelo ID
router.get("/get/:id", utilizadorController.utilizador_detail);

// POST: Criar novo utilizador
router.post("/create", utilizadorController.utilizador_create);

// PUT: Atualizar um utilizador existente
router.put("/update/:id", middleware.checkToken, utilizadorController.utilizador_update);

// DELETE: Apagar um utilizador
router.delete("/delete/:id", middleware.checkToken, utilizadorController.utilizador_delete);

//Imagem Perfil Utilizador
router.post("/upload-imagem-perfil", middleware.checkToken , upload.single("imagem-perfil"), utilizadorController.uploadImagemPerfil );

// token-fcm
router.post("/token-fcm", utilizadorController.updateTokenFCM);

module.exports = router;