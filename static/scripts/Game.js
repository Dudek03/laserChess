import Net from "./Net.js"
import WebGl from "./WebGl.js"
import Ui from "./Ui.js"
import Cube from "./Cube.js"
import Pawn from "./Pawn.js"
import LaserBeam from './Laser.js'
class Game {
  static instance
  static playerTurn
  constructor() {
    this.objectArray = []
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
          this.LaserBeam = new LaserBeam({
            reflectMax: 10
          });
          this.add2Scene(this.LaserBeam);
          this.LaserBeam2 = new LaserBeam({
            reflectMax: 10
          });
          this.add2Scene(this.LaserBeam2);
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
    this.objectArray = [];
    let count = 0;
    let much = 0;
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

        pawn.pawn.children.forEach((item, i) => {
          count++;
          if (item.type.trim() == "Mesh" && item.name != "shelder") {
            this.objectArray.push(item);
            console.log(item)
            much++;
          }
          // else{
            // item.children.forEach(meshInside =>{
            //   if(meshInside.type.trim() == "Mesh")
            //   this.objectArray.push(meshInside)
            // })
            // console.log(item)
          // }
          //
          // if (item.type.trim() == "Group")
          // item.children.forEach(mesh => {
          //   this.objectArray.push(mesh);
          //   much++;
          // })
        });
        if (this.pawns[i][j] == 1000 || (this.pawns[i][j] > 0 && this.pawns[i][j] < 100))
          pawn.pawn.children[1].material.color.setHex(0x0a0ab0)
        if (this.pawns[i][j] == 2000 || (this.pawns[i][j] > 100 && this.pawns[i][j] < 1000))
          pawn.pawn.children[1].material.color.setHex(0xb00a0a)

        //pawn.pawn.position.set(j * 20 - this.board.length / 2 * 20, 20, i * 20 - this.board.length / 2 * 20)
        pawn.pawn.position.set(j * 20 - this.board.length * 10, 20, (i - this.board.length / 2) * 20)
        pawn.pawn.rotation.y = this.rotation[i][j] * Math.PI/2  * -1
        this.webgl.scene.add(pawn.pawn)

      }
    }
    //red
    this.LaserBeam.object3d.position.set(-80, 30, -90)
    this.LaserBeam.intersect(
      new THREE.Vector3(0, 0, 40),
      this.objectArray
    );
    //blue
    this.LaserBeam2.object3d.position.set(100, 30, 60)
    this.LaserBeam2.intersect(
      new THREE.Vector3(0, 0, -40),
      this.objectArray
    );
    // dziala
    // this.LaserBeam2.intersect(
    //   new THREE.Vector3(0.3, 0, -40),
    //   this.objectArray
    // );
    // console.log(count)
    // console.log(much)
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
          if (this.clicked && (this.clicked.children[1].material.color.r > 0.69 && CLICKEDCOLOR.r > 0.69 || this.clicked.children[1].material.color.b > 0.69 && CLICKEDCOLOR.b > 0.69)) {
            if (this.clicked.children[1].material.color.r > 0.69)
              this.clicked.children[1].material.color.setHex(0xb00a0a)
            else
              this.clicked.children[1].material.color.setHex(0x0a0ab0)
            let greenCubes = this.cubesTable.filter(e => e.children[6].material.color.g == 1)
            greenCubes.forEach(e => {
              e.children[6].material.color.setHex(0x242424)
            })
          }
          if (this.clicked && CLICKEDNAME == 'Cube' && CLICKEDCOLOR.g == 1)
            console.log("lmao zamien to nizej")
          //this.move(clickedPawn.position)
          if (Ui.player.len == 1 && CLICKEDCOLOR.b > 0.69 /*&& Game.playerTurn == true*/ ) {
            if (clickedPawn == this.clicked)
              return
            console.log("gracz 1")
            this.clicked = clickedPawn
            this.moveValidator()
          } else if (Ui.player.len == 2 && CLICKEDCOLOR.r > 0.69 /*&& Game.playerTurn == false*/ ) {
            if (clickedPawn == this.clicked)
              return
            console.log("gracz 2")
            this.clicked = clickedPawn
            this.moveValidator()
          }
        }
      )
    }
  }

  add2Scene(obj) {
    this.webgl.scene.add(obj.object3d);
    this.webgl.scene.add(obj.pointLight);
    if (obj.reflectObject != null)
      this.add2Scene(obj.reflectObject);
  }

  moveValidator() {
    let x = (this.clicked.position.x + this.board.length * 10) / 20
    let y = (this.clicked.position.z + this.board.length * 10) / 20
    //console.log(x, y)
    this.clicked.children[1].material.color.setHex(0xede907)
  }

}

export default Game
