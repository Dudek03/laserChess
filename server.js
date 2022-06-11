var express = require("express")
var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;
app.use(express.static('static'))
var path = require("path")
const userController = require("./controllers/userController")
const databaseController = require("./database/databaseController")
const data = require("./Data")

//logowanie

app.post("/addPlayer", function (req, res){
    let response = userController.add(req)
    res.send(response)
})

app.get("/checkTabLen", function (req, res) {
    let response = userController.checkTabLength()
    res.send(response)
})

//wybór planszy

app.post("/playerBoardChoice", function(req, res) {
    let response = userController.addPlayerBoardChoice(req.body)
    res.send(response)
})

app.get("/chosenBoardLen", function(req, res) {
    let response = userController.checkChosenBoardLen()
    res.send(response)
})

app.get("/chooseFinalBoard", function(req, res){
    let response = userController.chooseFinalBoard()
    console.log(response, "serwer")
    console.log(data.finalBboard)
    res.send(JSON.stringify(response))
})

//pobranie tablic

app.get("/getTables", async (req, res) => {
    let response = await databaseController.getTabs()
    data.board = response.board
    data.pawns = response.pawns
    data.rotation = response.rotations
    res.send(JSON.stringify(response))
})

app.post("/playerMove", function(req, res){
    let response = userController.playerMove(req.body)
    res.send()
})

app.get("/getPawns", function (req, res) {
    res.send(JSON.stringify(data.pawns))
})

app.get("/getRotation", function (req, res) {
    res.send(JSON.stringify(data.rotation))
})

//______________
app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
