const express = require("express")
const app = express()
const path = require("path")
const RootRoute = require("./routes/root")

// This is to server any static files from our server
app.use("/", express.static(path.join(__dirname, "public")))

// This request stream sees this middleware first
app.use(RootRoute)


// This is for request that are not found
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


const port = process.env.PORT || 3500;
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})