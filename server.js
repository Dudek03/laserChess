var express = require("express")
var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;
app.use(express.static('static'))
var path = require("path")

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})