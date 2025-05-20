const express = require("express");
const router = express.Router();

const categoriacController = require("../controllers/categoriacController");

// GET: Listar todas as categorias
router.get("/list", categoriacController.categoria_list);

// GET: Detalhes de uma categoria pelo ID
router.get("/get/:id", categoriacController.categoria_detail);

// POST: Criar nova categoria
router.post("/create", categoriacController.categoria_create);

// PUT: Atualizar uma categoria existente
router.put("/update/:id", categoriacController.categoria_update);

// DELETE: Apagar uma categoria
router.delete("/delete/:id", categoriacController.categoria_delete);

module.exports = router;