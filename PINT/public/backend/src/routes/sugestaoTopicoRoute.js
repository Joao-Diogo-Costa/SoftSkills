const express = require("express");
const router = express.Router();

const sugestaoForumController = require("../controllers/sugestaoForumController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as sugestões
router.get("/list", sugestaoForumController.sugestao_list);

// GET: Detalhar uma sugestão por ID
router.get("/get/:id", sugestaoForumController.sugestao_detail);

// POST: Criar nova sugestão
router.post("/create", middleware.checkToken, sugestaoForumController.sugestao_create);

// PUT: Atualizar uma sugestão existente
router.put("/update/:id", middleware.checkToken, sugestaoForumController.sugestao_update);

// DELETE: Remover sugestão
router.delete("/delete/:id", middleware.checkToken, sugestaoForumController.sugestao_delete);

module.exports = router;
