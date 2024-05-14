const express = require("express");
const router = express.Router();
const {
	login,
	logout,
	register,
	verifyEmail,
	resetPassword,
	forgotPassword,
} = require("../controllers/authController");
const { authenticateUser } = require("../middlewares/authenticationMiddleware");

router.route("/login").post(login);
router.route("/logout").delete(authenticateUser, logout);
router.route("/register").post(register);
router.route("/verify-email").post(verifyEmail);
router.route("/reset-password").post(resetPassword);
router.route("/forgot-password").post(forgotPassword);

module.exports = router;
