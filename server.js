require("dotenv").config()
const express = require("express")
require("dotenv").config()
const app = express()
const path = require("path")
const { logger, logEvents } = require("./middlewares/logger")
const ErrorHandler = require("./middlewares/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")
const connectDB = require("./config/dbConn")
const mongoose = require("mongoose")
const RootRoute = require("./routes/root")
const UsersRoute = require("./routes/usersRoute")
const NotesRoute = require("./routes/notesRoutes")
const AuthRoutes = require("./routes/authRoute")


connectDB()

app.use(logger)

// Enable Cors
app.use(cors(corsOptions))

// Enable our server to proccess json
app.use(express.json())

// Enable our server to parse cookies
app.use(cookieParser())

// This is to server any static files from our server
app.use(express.static(path.join(__dirname, "public")))

// Use logger to get information about the request


// The request stream sees this middleware first
app.use("/", RootRoute)

// User Routes
app.use("/users", UsersRoute)

//Notes Routes
app.use("/notes", NotesRoute)

//Auth Routes
app.use("/auth", AuthRoutes)


// This is for requests that are not found
app.all("*", (req, res) => {
    res.status(404)
    if(req.accepts("html")) {
        res.sendFile(path.join(__dirname, "views", "404.html"))
    }else if (req.accepts("json")) {
        res.json({
            message: "Resource Not Found!!"
        })
    }else {
        res.type("txt").send("Resource Not Found!!")
    }
})

// This handles all errors
app.use(ErrorHandler)


const port = process.env.PORT;

mongoose.connection.once("open", () => {
    console.log("Connected to Mongodb")
    app.listen(port, () => {
        console.log(`Server running on port ${port}`)
    })
})

mongoose.connection.on("error", (err) => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLogs.log")
})