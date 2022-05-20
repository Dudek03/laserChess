var express = require("express")
var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const PORT = 3000;
app.use(express.static('static'))
var path = require("path")
const userController = require("./controllers/userController")

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
    res.send(response)
})

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})