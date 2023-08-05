const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../models/User")

const verifyJwt = (req, res, next) => {
    const requestHeaders = req.headers["authorization"] || req.headers["Authorization"]
    if(!requestHeaders) return res.status(401).json({ message: "Unauthorized" })

    //get token
    const token = requestHeaders.split(" ")[1]

    // verify token
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "forbidden" })
            }else {
                req.user = decoded?.userInfo.username;
                req.roles = decoded?.userInfo.roles;
                next()
            }
        },
    )
}

module.exports = verifyJwt