const express = require("express");
const router = express.Router();

const forumController = require("../controllers/forumController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// GET: Listar todos os fóruns
router.get("/list", forumController.forum_list);

// GET: Detalhar um fórum por ID
router.get("/get/:id", forumController.forum_detail);

// POST: Criar um novo fórum
router.post("/create", middleware.checkToken, middleware.authorize(['gestor']), forumController.forum_create);

// PUT: Atualizar um fórum existente
router.put("/update/:id", middleware.checkToken, middleware.authorize(['gestor']), forumController.forum_update);

// DELETE: Apagar um fórum
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor']), forumController.forum_delete);

// Upload imagem forum
router.post("/upload-imagem-forum/:forumId", middleware.checkToken , middleware.authorize(['gestor']), upload.single("imagem-forum"), forumController.uploadImagemForum);

module.exports = router;
