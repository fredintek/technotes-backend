const express = require("express");
const path = require("path")
const router = express.Router()
const { getAllUsers, createNewUser, updateUser, deleteUser } = require("../controllers/usersControllers")
const verifyJwt = require("../middlewares/verifyJwt")

router.use(verifyJwt)

router.route("/").get(getAllUsers).post(createNewUser).patch(updateUser).delete(deleteUser)



module.exports = router;