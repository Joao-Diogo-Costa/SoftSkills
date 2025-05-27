const express = require("express");
const router = express.Router();

const forumController = require("../controllers/forumController");
const middleware = require("../middlewares/middleware");

// GET: Listar todos os fóruns
router.get("/list", forumController.forum_list);

// GET: Detalhar um fórum por ID
router.get("/get/:id", forumController.forum_detail);

// POST: Criar um novo fórum
router.post("/create", middleware.checkToken, forumController.forum_create);

// PUT: Atualizar um fórum existente
router.put("/update/:id", middleware.checkToken, forumController.forum_update);

// DELETE: Apagar um fórum
router.delete("/delete/:id", middleware.checkToken, forumController.forum_delete);

module.exports = router;
