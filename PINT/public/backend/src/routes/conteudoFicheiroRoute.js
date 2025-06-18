const express = require("express");
const router = express.Router();

const conteudoFicheiroController = require("../controllers/conteudoFicheiroController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// Listar ficheiros de um conteúdo
router.get("/:conteudoId/ficheiros", middleware.checkToken, conteudoFicheiroController.listarFicheirosConteudo);

// Upload de ficheiros para um conteúdo
router.post("/:conteudoId/ficheiros", middleware.checkToken, upload.array("ficheiros"), conteudoFicheiroController.uploadFicheiroConteudo);

// Eliminar ficheiro de conteúdo
router.delete("/ficheiro/:fileId", middleware.checkToken, conteudoFicheiroController.deleteFicheiroConteudo);

module.exports = router;