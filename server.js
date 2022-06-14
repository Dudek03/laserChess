var express = require("express")
var app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000
app.use(express.static('static'))
var path = require("path")
const { createServer } = require("http");
const userController = require("./controllers/userController")
const databaseController = require("./database/databaseController")
const data = require("./Data")
const httpServer = createServer(app);
const { Server } = require("socket.io");
const Data = require("./Data");
const io = new Server(httpServer);

let gamesArray = [];

io.on("connection", (socket) => {
    const roomId = gamesArray.length
    socket.on("join", data => {
        if(gamesArray.length == 0 || gamesArray[gamesArray.length - 1].userTab.length == 2){
            gamesArray.push(new Data("room" + roomId, {id: socket.id, login: data.login}))
        }else{
            gamesArray[gamesArray.length - 1].userTab.push({id: socket.id, login: data.login})
        }
        socket.join(gamesArray[gamesArray.length - 1].gameId);
        if(gamesArray[gamesArray.length - 1].userTab.length == 2)
          io.to(gamesArray[gamesArray.length - 1].gameId).emit("fullRoom")
        socket.emit("player", gamesArray[gamesArray.length - 1].userTab.length)
    })
    socket.on("choosenMap", async (map) => {
        const room = gamesArray.find(e => e.userTab.find(f => f.id == socket.id))
        room.chosenBoards.push(map)
        if(room.chosenBoards.length == 2){
            userController.chooseFinalBoard(room)
            io.to("room" + roomId).emit("finalMap", await getTables(room) )
        }
    })
    socket.on("playerMove", async (move) => {
        console.log(move)
        const data = gamesArray.find(e => e.userTab.find(f => f.id == socket.id))
        console.log(data)
        userController.playerMove(move, data)
        console.log(data.turn)
        socket.to(data.gameId).emit("move", data)
        io.to(data.gameId).emit("turnChange", data)
        console.log(data.turn)
    })
    socket.on("removePawn", async (pawn) => {
        const data = gamesArray.find(e => e.userTab.find(f => f.id == socket.id))
        userController.removePawn(pawn, dprocess.env.PORT || ata)
        socket.to(data.gameId).emit("move", data)
    })
});
//pobranie tablic
async function getTables(room){
    let data = room
    let response = await databaseController.getTabs(data)
    data.board = response.board
    data.pawns = response.pawns
    data.rotation = response.rotations
    return {response, turn: data.turn}
}

app.post("/removePlayers", function (req, res){
    userController.restartGame()
    res.send()
})

//______________
httpServer.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})
