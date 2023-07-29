const User = require("../models/User")
const Note = require("../models/Note")

const asyncHandler = require("express-async-handler");
// const bcrypt = require("bcrypt")


// @desc Get All Users
// @route Get /users
// @access Private
const getAllUsers = asyncHandler(async(req, res) => {
    const users = await User.find().select("-password").lean()

    if(!users) return res.status(400).json({ message: "No Users Found" })

    res.status(200).json(users)
})


// @desc Create New User
// @route Post /users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body;

    //Confirm data
    if (!username || !password || !Array.isArray(roles) || !roles.length) {
        return res.status(400).json({
            message: "All fields are required"
        })
    }

    // Check for duplicates
    const duplicate = await User.findOne({ username }).lean().exec()
    if(duplicate) return res.status(409).json({ message: "Duplicate Username" })


    const hashedPwd = await bcrypt.hash(password, 10)

    const userObject = {
        username,
        "password": hashedPwd,
        roles
    }

    // Create and store new user
    const user = await User.create(userObject)
    if (user) {
        res.status(201).json({ message: `New user ${username} created` })
    }else {
        res.status(400).json({ message: "Invalid user data recieved" })
    }

})


// @desc Update A User
// @route Patch /users
// @access Private
const updateUser = asyncHandler(async (req, res) => {

    const { id, username, roles, active, password } = req.body;

    // confirm data
    if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== "boolean") return res.status(400).json({ message: "All fields are required" })

    const user = await User.findById(id).exec()

    if (!user) return res.status(400).json({ message: "User not found" })

    // check for duplicates
    const duplicates = await User.findOne({ username }).lean().exec()

    if (duplicates && duplicates._id !== id) return res.status(409).json({ message: "Duplicate username" })

    user.username = username
    user.roles = roles
    user.active = active

    if (password){
        user.password = await bcrypt.hash(password, 10)
    }

    const updatedUser = await user.save()

    res.json({ message: `${updatedUser.username} updated` })
})


// @desc Delete A User
// @route Delete /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {

})


module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}