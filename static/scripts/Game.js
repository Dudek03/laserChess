import Net from "./Net.js"
import WebGl from "./WebGl.js"
import Ui from "./Ui.js"
import {
  GLTFLoader
} from '../libs/GLTFLoader.js';
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
      //let ui = new Ui()
      this.net.addPlayer(name)
      const checklogin = setInterval(async () => {
        //console.log(await net.checkPlayers())
        if ((await this.net.checkPlayers()).len == 2) {
          clearInterval(checklogin)
          //this.createPawns()
          //this.getPawns()
          //this.createRaycaster()
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
        //console.log(await net.checkPlayers())
        if ((await this.net.checkChosenBoardLen()).len == 2) {
          clearInterval(checkBoardChoice)
          this.net.chooseFinalBoard()
          this.ui.removeAlert()
          let dbTable = await this.net.getTables()
          // console.log(dbTable.board)
          // console.log(this.webgl)

          const light = new THREE.DirectionalLight(0xffffff, 10);
          light.position.set(1, 1, 1);
          light.intensity = 1;
          this.webgl.scene.add(light);

          const light2 = new THREE.DirectionalLight(0xffffff, 10);
          light2.position.set(-1, -1, -1);
          light2.intensity = 1;
          this.webgl.scene.add(light2);
          this.createChessBoard(dbTable)
        }
      }, 1000)
    })
  }
  createChessBoard = async (dbTable) => {
    for (let i = 0; i < dbTable.board.length; i++) {
      for (let j = 0; j < dbTable.board[0].length; j++) {
        let cube = await this.loadModel("./models/pieceMap.glb")
        // console.log(cube)
        cube.position.set(-105 + j * 20, 0, -105 + i * 20)
        this.webgl.scene.add(cube)
      }
    }
  }
  loadModel = async (path) => {
    return new Promise((resolve, reject) => {
      let loader = new GLTFLoader();
      let spike = loader.load(path, async (glb) => {
        glb.scene.scale.set(10,10,10)
        console.log(glb.scene)
        resolve(glb.scene)
      })
    })
  }
}

export default Game
