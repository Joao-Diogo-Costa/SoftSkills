const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// POST: Realizar login
router.post("/login", authController.login);
// POST: Realizar forgotPassword
router.post("/forgot-password", authController.forgotPassword);
// POST: Realizar resetpassword
router.post("/reset-password", authController.resetPassword);

module.exports = router;