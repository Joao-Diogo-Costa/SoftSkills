const express = require("express");
const router = express.Router();

const statsController = require("../controllers/statController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as estasticas
router.get("/list", statsController.estatisticaController);

module.exports = router;