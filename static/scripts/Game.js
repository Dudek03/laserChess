import Net from "./Net.js"
import WebGl from "./WebGl.js"
import Ui from "./Ui.js"
import Cube from "./Cube.js"
import Pawn from "./Pawn.js"
class Game {
  static instance
  static playerTurn
  constructor() {
    Game.instance = this
    Game.playerTurn = true
    this.net = new Net
    this.webgl = new WebGl
    this.ui = new Ui
    this.cubesTable = []
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
          this.rotation = dbTab.rotations
          this.createChessBoard()
          this.createPawns()
          this.createRaycaster()
        }
      }, 1000)
    })
  }

  createRaycaster() {
    window.addEventListener("click", e => {
      this.raycast(e)
    })
  }

  createChessBoard = async () => {
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        let cube = new Cube
        await cube.init()
        if (this.board[i][j] == -2) {
          cube.cube.children[6].material.color.setHex(0xb00a0a)
          ///cube.cube.name = "lmao"
        } else if (this.board[i][j] == -1) {
          cube.cube.children[6].material.color.setHex(0x0a0ab0)
        }
        cube.cube.position.set(j * 20 - this.board.length / 2 * 20, 0, i * 20 - this.board.length / 2 * 20)
        this.webgl.scene.add(cube.cube)
        this.cubesTable.push(cube.cube)
      }
    }
  }

  createPawns = async () => {

    for (let i = 0; i < this.pawns.length; i++) {
      for (let j = 0; j < this.pawns[i].length; j++) {
        let pawn = new Pawn
        if (this.pawns[i][j] == 0)
          continue
        else if (this.pawns[i][j] == 1000 || this.pawns[i][j] == 2000) 
          await pawn.init("laser")
        else if (this.pawns[i][j] == 1 || this.pawns[i][j] == 101) 
          await pawn.init("king")
        else if (this.pawns[i][j] == 2 || this.pawns[i][j] == 102)
          await pawn.init("shelder")
        else if (this.pawns[i][j] == 3 || this.pawns[i][j] == 103)
          await pawn.init("shield")
        else if (this.pawns[i][j] == 4 || this.pawns[i][j] == 104)
          await pawn.init("disruptor")
        else if (this.pawns[i][j] == 5 || this.pawns[i][j] == 105)
          await pawn.init("mirror")
        else if (this.pawns[i][j] == 6 || this.pawns[i][j] == 106)
          await pawn.init("sentry")

        if (this.pawns[i][j] == 1000 || (this.pawns[i][j] > 0 && this.pawns[i][j] < 100)){
          pawn.pawn.children[1].material.color.setHex(0x0a0ab0)
          pawn.pawn.children[0].name += "-Blue"
        }
        if (this.pawns[i][j] == 2000 || (this.pawns[i][j] > 100 && this.pawns[i][j] < 1000)){
          pawn.pawn.children[1].material.color.setHex(0xb00a0a)
          pawn.pawn.children[0].name += "-Red"
        }
          
        pawn.pawn.position.set(j * 20 - this.board.length * 10, 20, (i - this.board.length / 2) *20)
        pawn.pawn.rotation.y = this.rotation[i][j] * Math.PI / 2 * -1
        this.webgl.scene.add(pawn.pawn)
      }
    }
  }

  raycast(e) {
    const raycaster = new THREE.Raycaster()
    const mouseVector = new THREE.Vector2()
    mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1
    mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouseVector, this.webgl.camera)
    const intersects = raycaster.intersectObjects(this.webgl.scene.children)
    if (intersects.length > 0) {
      intersects[0].object.traverseAncestors(
        (clickedPawn) => {
          if (clickedPawn.name != "Scene") return
          const CLICKEDCOLOR = clickedPawn.children[1].material.color
          const CLICKEDNAME = clickedPawn.children[0].name
          console.log(CLICKEDCOLOR.r, "ray", CLICKEDCOLOR.b, CLICKEDNAME)
          console.log(clickedPawn)
          if(this.clicked && (this.clicked.children[0].name.split("-")[1] == "Red" && CLICKEDNAME.split("-")[1] == "Red" || this.clicked.children[0].name.split("-")[1] == "Blue" && CLICKEDNAME.split("-")[1] == "Blue")){
            if(this.clicked.children[0].name.split("-")[1] == "Red")
              this.clicked.children[1].material.color.setHex(0xb00a0a)
            
            if(this.clicked.children[0].name.split("-")[1] == "Blue")
              this.clicked.children[1].material.color.setHex(0x0a0ab0)
              
            let greenCubes = this.cubesTable.filter(e => e.children[6].material.color.g == 1)
            greenCubes.forEach(e => {e.children[6].material.color.setHex(0x242424)})
          }
          if(this.clicked && CLICKEDNAME == 'cube' && CLICKEDCOLOR.g == 1)
            console.log("Potem usune ten console log ale na razie jest potrzebny")
            //this.move(clickedPawn.position)
          if(Ui.player.len == 1 && CLICKEDCOLOR.b > 0.69 /*&& Game.playerTurn == true*/){
            if(clickedPawn == this.clicked || CLICKEDNAME == "cube")
              return
            this.clicked = clickedPawn
            this.moveValidator()
          }
          else if(Ui.player.len == 2 && CLICKEDCOLOR.r > 0.69 /*&& Game.playerTurn == false*/){
            if(clickedPawn == this.clicked || CLICKEDNAME == "cube")
              return
            this.clicked = clickedPawn
            this.moveValidator()
          }
        }
      )
    }
  }

  moveValidator(){
    let x = (this.clicked.position.x + this.board.length * 10) / 20
    let y = (this.clicked.position.z + this.board.length * 10) / 20
    //console.log(x, y)
    this.clicked.children[1].material.color.setHex(0xede907)
  }

}

export default Game
