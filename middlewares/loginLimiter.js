const limiter = require("express-rate-limit")


const rateLimiter = limiter({
    windowMs: 60 * 1000,
    max: 5,
    handler: (req, res, next, options) => {
        // you can put your logger here
        res.status(options.statusCode).send(options.message)
    },
    standardHeaders: true,
    legacyHeaders: false
})


module.exports = rateLimiter