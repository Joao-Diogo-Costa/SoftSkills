const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const middleware = require("../middlewares/middleware");

//POST: realizar registo
router.post('/register', authController.register);
// POST: Realizar login
router.post("/login", authController.login);
// POST: Realizar forgotPassword
router.post("/forgot-password", authController.forgotPassword);
// POST: Realizar resetpassword
router.post("/reset-password/:token", authController.resetPassword);
// PATCH : updatePassword
router.patch('/updatePassword', middleware.checkToken, authController.updatePassword);
//PATCH: só no primeiro login
router.patch('/forceUpdatePassword', authController.forceUpdatePassword); 
//PUT: aprovar utilizador
router.put('/aprovar/:id', middleware.checkToken, middleware.authorize(['gestor']), authController.aprovarUtilizador);

module.exports = router;