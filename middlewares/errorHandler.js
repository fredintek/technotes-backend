const { logEvents } = require("./logger")


module.exports = (err, req, res, next) => {
    console.log("ERROR -->", err)
    console.log("ERROR STACK -->", err.stack)
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, "errLogs.log")


    const status = res.statusCode || 500;
    res.status(status)


    res.json({
        message: err.message
    })
}