const express = require("express");
const router = express.Router();

const gestorController = require("../controllers/gestorController");

// GET: Listar todos os gestores com os cursos associados
router.get("/list", gestorController.gestor_list);

// GET: Detalhar um gestor por ID
router.get("/get/:id", gestorController.gestor_detail);

// POST: Criar um novo gestor e associar cursos
router.post("/create", gestorController.gestor_create);

// PUT: Atualizar um gestor existente
router.put("/update/:id", gestorController.gestor_update);

// DELETE: Apagar um gestor
router.delete("/delete/:id", gestorController.gestor_delete);

module.exports = router;
