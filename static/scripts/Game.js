import Net from "./Net.js"
import WebGl from "./WebGl.js"
import Ui from "./Ui.js"
import Cube from "./Cube.js"
import Pawn from "./Pawn.js"
class Game {
  static instance
  constructor() {
    Game.instance = this
    this.net = new Net
    this.webgl = new WebGl
    this.ui = new Ui
    this.createListeners()
  }

  createListeners() {
    let playerChoice
    const possibleChoices = document.querySelectorAll(".choice")

    document.getElementById("logOn").addEventListener("click", () => {
      let name = document.getElementById("login").value
      this.net.addPlayer(name)
      const checklogin = setInterval(async () => {
        if ((await this.net.checkPlayers()).len == 2) {
          clearInterval(checklogin)
          this.ui.removeAlert()
          this.ui.displayBoardChoice()
        }
      }, 1000)
    })

    document.getElementById("reset").addEventListener("click", () => {
      //this.net.removePlayer()
      console.log("reset lol")
    })

    possibleChoices.forEach(e => {
      e.addEventListener("click", () => {
        playerChoice = e.attributes[1].value
        console.log(playerChoice)
      })
    })

    document.getElementById("sendBoardChoice").addEventListener("click", () => {
      let name = document.getElementById("logged").innerText
      this.net.playerBoardChoice(playerChoice, name)
      this.ui.waitForSecondPlayerChoice()
      //PRZEPISAC NA SOCKET !!!
      const checkBoardChoice = setInterval(async () => {
        if ((await this.net.checkChosenBoardLen()).len == 2) {
          clearInterval(checkBoardChoice)
          this.net.chooseFinalBoard()
          this.ui.removeAlert()
          const dbTab = await this.net.getTables()
          this.pawns = dbTab.pawns
          this.board = dbTab.board
          this.rotation = dbTab.rotation

          this.createChessBoard()
          this.createPawns()
        }
      }, 1000)
    })
  }

  createChessBoard = async () => {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        let cube = new Cube
        await cube.init()
        if (this.board[i][j] == -2) {
          cube.cube.children[6].material.color.setHex(0xff0000)
        }
        else if (this.board[i][j] == -1) {
          cube.cube.children[6].material.color.setHex(0x0000ff)
        }
        cube.cube.position.set(j * 20 - this.board.length / 2 * 20 - 10, 0, i * 20 - this.board.length / 2 * 20)
        this.webgl.scene.add(cube.cube)
      }
    }
  }

  createPawns = async () => {
    let pawn
    for(let i = 0; i < this.pawns.length; i++){
      for(let j = 0; j < this.pawns[i].length; j++){
        if(this.pawns[i][j] == 0)
          continue
        else if(this.pawns[i][j] == 1000 || this.pawns[i][j] == 2000){
          pawn = new Pawn
          await pawn.init("laser")
        }
        else if(this.pawns[i][j] == 1 || this.pawns[i][j] == 101){
          pawn = new Pawn
          await pawn.init("king")

          // if(this.pawns[i][j] == 101)
        }
        else if(this.pawns[i][j] == 2 || this.pawns[i][j] == 102){
          pawn = new Pawn
          await pawn.init("shelder")
        }
        else if(this.pawns[i][j] == 3 || this.pawns[i][j] == 103){
          pawn = new Pawn
          await pawn.init("shield")
        }
        else if(this.pawns[i][j] == 4 || this.pawns[i][j] == 104){
          pawn = new Pawn
          await pawn.init("disruptor")
        }
        else if(this.pawns[i][j] == 5 || this.pawns[i][j] == 105){
          pawn = new Pawn
          await pawn.init("spike")
        }
        else if(this.pawns[i][j] == 6 || this.pawns[i][j] == 106){
          pawn = new Pawn
          await pawn.init("sentry")
        }

        pawn.pawn.position.set(j * 20 - this.board.length / 2 * 20 - 10, 20, i * 20 - this.board.length / 2 * 20)
        this.webgl.scene.add(pawn.pawn)
      }
    }
  }

}

export default Game
