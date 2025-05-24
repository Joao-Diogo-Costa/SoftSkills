const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
//POST: realizar registo
router.post('/register', authController.register);
// POST: Realizar login
router.post("/login", authController.login);
// POST: Realizar forgotPassword
router.post("/forgot-password", authController.forgotPassword);
// POST: Realizar resetpassword
router.post("/reset-password/:token", authController.resetPassword);
// PATCH : updatePassword
router.patch('/updatePassword', authController.updatePassword);


module.exports = router;