const express = require("express");
const router = express.Router();

const topicocController = require("../controllers/topicocController");
const middleware = require("../middlewares/middleware");

// GET: Listar todos os tópicos
router.get("/list", topicocController.topicoc_list);

// GET: Detalhar um tópico por ID
router.get("/get/:id", topicocController.topicoc_detail);

// POST: Criar novo tópico
router.post("/create", middleware.checkToken, middleware.authorize(['gestor']), topicocController.topicoc_create);

// PUT: Atualizar um tópico existente
router.put("/update/:id", middleware.checkToken,middleware.authorize(['gestor']), topicocController.topicoc_update);

// DELETE: Remover tópico
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor']),  topicocController.topicoc_delete);

module.exports = router;
