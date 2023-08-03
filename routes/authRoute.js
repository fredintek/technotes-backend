const express = require("express")
const loginLimiter = require("../middlewares/loginLimiter")
const router = express.Router();
const { login, refresh, logout } = require("../controllers/authController")


router.route("/").post(loginLimiter, login)


router.route("/refresh").get(refresh)


router.route("/logout").post(logout)



module.exports = router;