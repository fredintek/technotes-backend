const express = require("express");
const path = require("path")
const router = express.Router()
const { getAllUsers, createNewUser, updateUser, deleteUser } = require("../controllers/usersControllers")

router.route("/").get(getAllUsers).post(createNewUser).patch(updateUser).delete(deleteUser)



module.exports = router;