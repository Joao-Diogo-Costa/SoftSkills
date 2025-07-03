const express = require("express");
const router = express.Router();

const documentoAulaController = require("../controllers/documentoAulaController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// Listar ficheiros de uma aula assíncrona
router.get("/:aulaAssincronaId/ficheiros", middleware.checkToken, documentoAulaController.listarFicheirosAula);

// Upload de ficheiros para uma aula assíncrona
router.post("/:aulaAssincronaId/ficheiros", middleware.checkToken, upload.array("ficheiros"), documentoAulaController.uploadFicheiroAula);

// Eliminar ficheiro de aula
router.delete("/ficheiro/:fileId", middleware.checkToken, documentoAulaController.deleteFicheiroAula);

module.exports = router;
