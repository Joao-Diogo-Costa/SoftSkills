const express = require("express");
const router = express.Router();

const tarefaFicheiroController = require("../controllers/tarefaFicheiroController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// Listar ficheiros de uma tarefa
router.get("/:tarefaId/ficheiro", middleware.checkToken, tarefaFicheiroController.listarFicheirosTarefa);

// Upload de ficheiros de enunciado da tarefa (formador)
router.post("/:tarefaId/ficheiro", middleware.authorize(['gestor', 'formador']), middleware.checkToken, upload.array("ficheiros"), tarefaFicheiroController.uploadTarefaFicheiro);

// Eliminar ficheiro de enunciado da tarefa
router.delete("/ficheiro/:fileId", middleware.checkToken, middleware.authorize(['gestor', 'formador']),  tarefaFicheiroController.deleteTarefaFicheiro );

module.exports = router;