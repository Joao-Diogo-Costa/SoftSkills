const express = require("express");
const router = express.Router();

const forumFicheiroController = require("../controllers/forumFicheiroController");
const middleware = require("../middlewares/middleware");
const upload = require("../config/multerConfig");

// POST: Upload de ficheiros para o fórum (campo 'ficheiros' no form)
router.post( "/upload/:forumId", middleware.checkToken, upload.array("ficheiros"), forumFicheiroController.uploadFicheiroForum );

// DELETE: Apagar ficheiro do fórum
router.delete( "/delete/:fileId", middleware.checkToken, forumFicheiroController.deleteFicheiroForum);

module.exports = router;