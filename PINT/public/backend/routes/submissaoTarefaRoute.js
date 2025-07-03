const express = require("express");
const router = express.Router();

const submissaoTarefaController = require("../controllers/submissaoTarefaController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// Listar submissões de tarefa
router.get("/list", middleware.checkToken, submissaoTarefaController.submissao_list);

//listar submissóes de tarefa por atrefaid
router.get("/por-tarefa/:tarefaId", middleware.checkToken, submissaoTarefaController.listarPorTarefa);

// Detalhe de submissão
router.get("/get/:id", middleware.checkToken, submissaoTarefaController.submissao_detail);

// PUT /submissao-tarefa/:id/nota
router.put("/:id/nota", submissaoTarefaController.atualizarNota);

// Submeter ficheiro de tarefa
router.post(
  "/upload/:idTarefa",
  middleware.checkToken,
  middleware.authorize(['gestor', 'formando']),
  upload.single("ficheiro"),
  submissaoTarefaController.uploadSubmissaoTarefa
);


// Eliminar submissão de tarefa
router.delete(
  "/delete/:submissaoId",
  middleware.checkToken,
  middleware.authorize(['gestor', 'formando']),
  submissaoTarefaController.deleteSubmissaoTarefa
);

module.exports = router;