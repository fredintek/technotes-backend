const express = require("express")
const app = express()
const path = require("path")
const RootRoute = require("./routes/root")
const { logger } = require("./middlewares/logger")
const ErrorHandler = require("./middlewares/errorHandler")
const cookieParser = require("cookie-parser")
const cors = require("cors")
const corsOptions = require("./config/corsOptions")

app.use(logger)

// Enable Cors
app.use(cors(corsOptions))

// Enable our server to proccess json
app.use(express.json())

// Enable our server to parse cookies
app.use(cookieParser())

// This is to server any static files from our server
app.use("/", express.static(path.join(__dirname, "public")))

// Use logger to get information about the request


// The request stream sees this middleware first
app.use(RootRoute)


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


const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})