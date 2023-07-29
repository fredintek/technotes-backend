const { format } = require("date-fns");
const { v4:uuid } = require("uuid")
const fs = require("fs")
const fsPromises = require("fs").promises;
const path = require("path")


// Helper function to create log events
const logEvents = async(message, filename) => {
    const dateTime = format(new Date(), 'yyyyMMdd\tHH:mm:ss')
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`


    try {

        if (!fs.existsSync(path.join(__dirname, "..", "logs"))){
            await fsPromises.mkdir(path.join(__dirname, "..", "logs"))
        }

        await fsPromises.appendFile(path.join(__dirname, "..", "logs", filename), logItem)
        
    } catch (error) {
        console.log(error)
    }
}


// logger middleware for requests
const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLogs.log")
    console.log(`${req.method} ${req.path}`)
    next()
}


module.exports = { logger, logEvents }