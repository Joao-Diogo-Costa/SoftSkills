const express = require("express");
const router = express.Router();

const areaController = require("../controllers/areacController");
const middleware = require("../middlewares/middleware");

// GET: Listar todas as áreas
router.get("/list", areaController.area_list);

// GET: Detalhes de uma área pelo ID
router.get("/get/:id", areaController.area_detail);

// POST: Criar nova área
router.post("/create", middleware.checkToken, middleware.authorize(['gestor']), areaController.area_create);

// PUT: Atualizar uma área existente
router.put("/update/:id", middleware.checkToken, middleware.authorize(['gestor']), areaController.area_update);

// DELETE: Apagar uma área
router.delete("/delete/:id", middleware.checkToken, middleware.authorize(['gestor']), areaController.area_delete);

module.exports = router;
