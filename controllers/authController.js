const User = require("../models/User")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");


//@desc Login
//@route POST /auth
//@access Public
exports.login = asyncHandler(async (req, res) => {
    const { username, password } = req.body;

    // check if user inputs credentials
    if(!username || !password) return res.status(400).json({ message: "All fields are required" })

    //lets find the user in database
    const foundUser = await User.findOne({ username }).exec()

    //check if user exists or is active
    if (!foundUser || !foundUser.active) return res.status(401).json({ message: "Unauthorized" })

    //now compare passwords
    const validPassword = await bcrypt.compare(password, foundUser.password);
    if(!validPassword) return res.status(401).json({ message: "Unauthorized" })


    //now create accesstoken, refreshtoken, and send cookie
    const accessToken = jwt.sign(
        {
            "userInfo": {
                "username": foundUser.username,
                "roles": foundUser.roles
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15s" }
    )

    const refreshtoken = jwt.sign(
        {
            "username": foundUser.username
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
    )

    res.cookie("jwt", refreshtoken, {
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    res.status(200).json({ accessToken })

})


//@desc Refresh
//@route GET /auth/refresh
//@access Public - because access token has expired
exports.refresh = asyncHandler(async (req, res) => {

    const refreshToken = req.cookies?.jwt

    if (!refreshToken) return res.status(401).json({ message: "Unauthorized" })

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET, 
        asyncHandler(async(err, decoded) => {
            if(err) return res.status(403).json({ message: "Forbidden" })

            const foundUser = await User.findOne({ username: decoded?.username }).exec()

            if(!foundUser) return res.status(401).json({ message: "Unauthorized" })

            const accessToken = jwt.sign(
                {
                    "userInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: "15s" }
            )

            res.status(200).json({ accessToken })
        })
    )

})


//@desc Logout
//@route GET /auth/logout
//@access Public
exports.logout = asyncHandler(async (req, res) => {
    const cookies = req.cookies

    if(!cookies?.jwt) return res.sendStatus(204)

    res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    })

    res.json({ message: "Cookie Cleared" })
})

