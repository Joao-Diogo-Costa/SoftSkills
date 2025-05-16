const express = require("express");
const router = express.Router();

const tarefaController = require("../controllers/tarefaController");

// GET: Listar todas as tarefas
router.get("/list", tarefaController.tarefa_list);

// GET: Detalhar uma tarefa por ID
router.get("/get/:id", tarefaController.tarefa_detail);

// POST: Criar nova tarefa
router.post("/create", tarefaController.tarefa_create);

// PUT: Atualizar uma tarefa existente
router.put("/update/:id", tarefaController.tarefa_update);

// DELETE: Remover tarefa
router.delete("/delete/:id", tarefaController.tarefa_delete);

module.exports = router;