import Net from "./Net.js"
import WebGl from "./WebGl.js"
import Ui from "./Ui.js"
import Cube from "./Cube.js"
import Pawn from "./Pawn.js"
import LaserBeam from './Laser.js'
import {
  GLTFLoader
} from '../libs/GLTFLoader.js'
class Game {
  static instance
  static playerTurn
  constructor(socket) {
    this.socket = socket
    this.rotationLaserX = 0;
    this.rotationLaserY = 0;
    this.rotationLaserZ = 40;
    this.objectArray = []
    Game.instance = this
    Game.playerTurn = true
    this.net = new Net(socket)
    this.webgl = new WebGl
    this.ui = new Ui
    this.cubesTable = []
    this.pawnTable = []
    this.arrowChoice = document.querySelectorAll(".arrowChoice")

    this.createListeners()
  }

  createListeners() {
    let playerChoice
    const possibleChoices = document.querySelectorAll(".choice")

    document.getElementById("logOn").addEventListener("click", () => {
      let name = document.getElementById("login").value
      this.net.addPlayer(name)
    })

    document.getElementById("reset").addEventListener("click", () => {
      this.net.removePlayer()
      console.log("reset lol")
    })

    possibleChoices.forEach(e => {
      e.addEventListener("click", () => {
        playerChoice = e.attributes[1].value
        console.log(playerChoice)
      })
    })

    this.arrowChoice.forEach(e => {
      e.addEventListener("click", () => {
        let rotation = e.attributes[2].value
        this.move(rotation)
        //console.log(rotation)
      })
    })

    document.getElementById("sendBoardChoice").addEventListener("click", () => {
      let name = document.getElementById("logged").innerText
      this.net.playerBoardChoice(playerChoice, name)
      this.ui.waitForSecondPlayerChoice()
      //PRZEPISAC NA SOCKET !!!
      this.socket.on("finalMap", (getTables) => {
        this.loadMap(getTables)
      })
    })
  }

  async loadMap(dbTab){
    console.log(dbTab)
    const turn = dbTab.turn
    dbTab = dbTab.response
    this.ui.removeAlert()
    this.pawns = dbTab.pawns
    this.board = dbTab.board
    this.rotation = dbTab.rotations
    this.turn = turn
    this.createChessBoard()
    this.createPawns()
    this.createRaycaster()
    this.socket.on("move", (move) => {
      console.log(move)
      this.checkForChanges(move)
      if (Game.playerTurn != move.turn)
        Game.playerTurn = move.turn
    })
  }

  createRaycaster() {
    window.addEventListener("click", e => {
      this.raycast(e)
    })
  }

  createChessBoard = async () => {
    let loader = new GLTFLoader();
    let cub3 = new Cube
    cub3.cube = await cub3.loadModel(loader);
    for (let i = 0; i < this.board.length; i++) {
      for (let j = 0; j < this.board[i].length; j++) {
        let cube = new Cube
        cube.cube = cub3.cube.clone();
        cube.cube.children[6].material = cub3.cube.children[6].material.clone()
        if (this.board[i][j] == -2) {
          cube.cube.children[6].material.color.setHex(0xb00a0a)
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
        if (pawn.pawn.name != "laser") {
          pawn.pawn.children.forEach((item, i) => {
            if (item.type.trim() == "Mesh" && item.name != "shelder") {
              this.objectArray.push(item);
            }
          });
        }

        if (this.pawns[i][j] == 1000 || (this.pawns[i][j] > 0 && this.pawns[i][j] < 100)) {

          pawn.pawn.children[1].material.color.setHex(0x0a0ab0)
          pawn.pawn.children[0].name += "-Blue"
        }
        if (this.pawns[i][j] == 2000 || (this.pawns[i][j] > 100 && this.pawns[i][j] < 1000)) {
          pawn.pawn.children[1].material.color.setHex(0xb00a0a)
          pawn.pawn.children[0].name += "-Red"
        }

        pawn.pawn.position.set(j * 20 - this.board.length * 10, 20, (i - this.board.length / 2) * 20)
        pawn.pawn.rotation.y = this.rotation[i][j] * Math.PI / 2 * -1
        this.pawnTable.push(pawn.pawn)
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
          if (this.clicked && (this.clicked.children[0].name.split("-")[1] == "Red" && CLICKEDNAME.split("-")[1] == "Red" || this.clicked.children[0].name.split("-")[1] == "Blue" && CLICKEDNAME.split("-")[1] == "Blue")) {
            this.ui.hideArrows()
            if (this.clicked.children[0].name.split("-")[1] == "Red")
              this.clicked.children[1].material.color.setHex(0xb00a0a)

            if (this.clicked.children[0].name.split("-")[1] == "Blue")
              this.clicked.children[1].material.color.setHex(0x0a0ab0)

            let greenCubes = this.cubesTable.filter(e => e.children[6].material.color.g == 1)

            greenCubes.forEach(e => {
              let x = (e.position.x + this.board.length * 10) / 20
              let y = (e.position.z + this.board.length * 10) / 20
              if (this.board[y][x] == -2) {
                e.children[6].material.color.setHex(0xb00a0a)
              } else if (this.board[y][x] == -1) {
                e.children[6].material.color.setHex(0x0a0ab0)
              } else if (this.board[y][x] == 1) {
                e.children[6].material.color.setHex(0x242424)
              }
            })
            //this.clicked = null
          }
          if (this.clicked && CLICKEDNAME == 'cube' && clickedPawn.children[6].material.color.g == 1 && clickedPawn.children[6].material.color.r == 0 && clickedPawn.children[6].material.color.b == 0) {
            this.move(clickedPawn.position)
          }

          if (Ui.player.len == 1 && CLICKEDCOLOR.b > 0.69 && Game.playerTurn == true) {
            if (clickedPawn == this.clicked || CLICKEDNAME == "cube")
              return
            this.clicked = clickedPawn
            this.moveValidator()

          } else if (Ui.player.len == 2 && CLICKEDCOLOR.r > 0.69 && Game.playerTurn == false) {
            if (clickedPawn == this.clicked || CLICKEDNAME == "cube")
              return
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
  removeFromScene(obj) {
    this.webgl.scene.remove(obj.object3d);
    this.webgl.scene.remove(obj.pointLight);
    if (obj.reflectObject != null)
      this.removeFromScene(obj.reflectObject);
  }
  moveValidator() {
    if (!this.clicked) return
    //console.log(this.clicked)
    console.table(this.pawns)
    const THISCLICKEDNAME = this.clicked.children[0].name.split("-")
    let foundCube
    let cubesToCHange = []
    let x = (this.clicked.position.x + this.board.length * 10) / 20
    let y = (this.clicked.position.z + this.board.length * 10) / 20
    console.log(x, y, "pozycja", THISCLICKEDNAME[0])
    this.clicked.children[1].material.color.setHex(0xede907)
    this.ui.displayArrows()
    if (THISCLICKEDNAME[0] == "laser") return
    if (y + 1 <= this.board.length - 1 && y + 1 >= 0) {
      if (this.pawns[y + 1][x] == 0 && (THISCLICKEDNAME[1] == "Red" && this.board[y + 1][x] != -1 || THISCLICKEDNAME[1] == "Blue" && this.board[y + 1][x] != -2)) {
        foundCube = this.cubesTable.find(e => e.position.x == (x - this.board.length / 2) * 20 && e.position.z == ((y + 1) - this.board.length / 2) * 20)
        cubesToCHange.push(foundCube)
      }
    }
    if (y - 1 <= this.board.length - 1 && y - 1 >= 0) {
      if (this.pawns[y - 1][x] == 0 && (THISCLICKEDNAME[1] == "Red" && this.board[y - 1][x] != -1 || THISCLICKEDNAME[1] == "Blue" && this.board[y - 1][x] != -2)) {
        foundCube = this.cubesTable.find(e => e.position.x == (x - this.board.length / 2) * 20 && e.position.z == ((y - 1) - this.board.length / 2) * 20)
        cubesToCHange.push(foundCube)
      }
    }
    if (x + 1 <= this.board[y].length - 1 && x + 1 >= 0) {
      for (let i = -1; i < 2; i++) {
        if (y + i <= this.board.length - 1 && y + i >= 0) {
          if (this.pawns[y + i][x + 1] == 0 && (THISCLICKEDNAME[1] == "Red" && this.board[y + i][x + 1] != -1 || THISCLICKEDNAME[1] == "Blue" && this.board[y + i][x + 1] != -2)) {
            foundCube = this.cubesTable.find(e => e.position.x == ((x + 1) - this.board.length / 2) * 20 && e.position.z == ((y + i) - this.board.length / 2) * 20)
            cubesToCHange.push(foundCube)
          }
        }
      }
    }
    if (x - 1 <= this.board[y].length - 1 && x - 1 >= 0) {
      for (let i = -1; i < 2; i++) {
        if (y + i <= this.board.length - 1 && y + i >= 0) {
          if (this.pawns[y + i][x - 1] == 0 && (THISCLICKEDNAME[1] == "Red" && this.board[y + i][x - 1] != -1 || THISCLICKEDNAME[1] == "Blue" && this.board[y + i][x - 1] != -2)) {
            foundCube = this.cubesTable.find(e => e.position.x == ((x - 1) - this.board.length / 2) * 20 && e.position.z == ((y + i) - this.board.length / 2) * 20)
            cubesToCHange.push(foundCube)
          }
        }
      }
    }

    cubesToCHange.forEach(e => {
      e.children[6].material.color.setHex(0x00ff00)
    })
  }

  move = async (pos) => {
    if (this.LaserBeam)
      this.removeFromScene(this.LaserBeam)
    let rot = this.clicked.children.find(mech => mech.name == "Cube008")
    let modelNum
    let positions = {
      color: this.clicked.children[0].name.split("-")[1],
      oldX: (this.clicked.position.x + this.board.length * 10) / 20,
      oldZ: (this.clicked.position.z + this.board.length * 10) / 20
    }
    this.ui.hideArrows()
    if (this.clicked.children[0].name.split("-")[1] == "Red")
      this.clicked.children[1].material.color.setHex(0xb00a0a)

    if (this.clicked.children[0].name.split("-")[1] == "Blue")
      this.clicked.children[1].material.color.setHex(0x0a0ab0)

    let greenCubes = this.cubesTable.filter(e => e.children[6].material.color.g == 1)
    greenCubes.forEach(e => {
      let x = (e.position.x + this.board.length * 10) / 20
      let y = (e.position.z + this.board.length * 10) / 20
      if (this.board[y][x] == -2) {
        e.children[6].material.color.setHex(0xb00a0a)
      } else if (this.board[y][x] == -1) {
        e.children[6].material.color.setHex(0x0a0ab0)
      } else if (this.board[y][x] == 1) {
        e.children[6].material.color.setHex(0x242424)
      }
    })
    console.log(this.clicked)
    console.log(pos, "move")

    let laserRotation = 0;
    if (typeof(pos) == "string") {
      let rotation
      if (pos == "left") {
        rotation = -1
      } else if (pos == "right") {
        rotation = 1
      }

      if (this.clicked.children[0].name.split("-")[0] == "laser") {
        if (this.rotation[positions.oldZ][positions.oldX] % 2 == 0) {
          this.rotationLaserX = 40;
          this.rotationLaserZ = 0;
        } else {
          this.rotationLaserX = 0;
          this.rotationLaserZ = 40;
        }
      }
      positions.newX = "none"
      positions.newZ = "none"
      positions.rotation = rotation
      this.rotation[positions.oldZ][positions.oldX] += rotation
      this.clicked.rotation.y = this.rotation[positions.oldZ][positions.oldX] * Math.PI / 2 * -1
      // this.objectArray.
      // objectArray.splice(index,1,newMesh)
    } else if (typeof(pos) == "object") {
      positions.newX = (pos.x + this.board.length * 10) / 20,
        positions.newZ = (pos.z + this.board.length * 10) / 20,
        positions.rotation = "none"
      // new TWEEN.Tween(this.clicked.position)
      //       .to({ x: pos.x, y: 20, z: pos.z }, 200)
      //       .easing(TWEEN.Easing.Quadratic.Out)
      //       .start()
      // this.clicked.position.x = await pos.x
      // this.clicked.position.z = await pos.z

      modelNum = this.pawns[positions.oldZ][positions.oldX]
      this.pawns[positions.oldZ][positions.oldX] = 0
      this.pawns[positions.newZ][positions.newX] = modelNum
    }
    await this.net.playerMove(positions)
    await this.webgl.smoothyMove(this.clicked, pos)

    await this.webgl.smoothyMove(this.clicked,pos)

    this.clicked = null


    setTimeout(()=>{
      this.laserShoot(Ui.player.len)
    this.socket.emit("playerMove", positions)

    },300)
  }

  checkForChanges = async (data) => {
    let serverPawns = data.pawns
    let serverRotations = data.rotation
    let newX
    let newZ
    let foundPawn
    let rotation = null
    let remove
    //ruch
    for (let i = 0; i < serverPawns.length; i++) {
      for (let j = 0; j < serverPawns[i].length; j++) {
        if (serverPawns[i][j] == this.pawns[i][j]) continue
        else if (serverPawns[i][j] != this.pawns[i][j]) {
          if (serverPawns[i][j] == 0 && this.pawns[i][j] != 0) {
            console.log("usunieto?")
            foundPawn = this.pawnTable.find(e => e.position.x == (j - this.board.length / 2) * 20 && e.position.z == (i - this.board.length / 2) * 20)
            // console.log(this.pawnTable)
          }
          if (serverPawns[i][j] != 0 && this.pawns[i][j] == 0) {
            newX = j
            newZ = i
          }
        }
      }
    }

    if (foundPawn && newX >= 0 && newZ >= 0) {
      if (foundPawn.position.x != (newX - this.board.length / 2) * 20 || foundPawn.position.z != (newZ - this.board.length / 2) * 20)
        await this.webgl.smoothyMove(foundPawn, {
          x: (newX - this.board.length / 2) * 20,
          y: 20,
          z: (newZ - this.board.length / 2) * 20
        });
    }
    ///rotacja
    for (let i = 0; i < serverRotations.length; i++) {
      for (let j = 0; j < serverRotations[i].length; j++) {
        if (serverRotations[i][j] == this.rotation[i][j]) continue
        else if (serverRotations[i][j] != this.rotation[i][j]) {
          foundPawn = this.pawnTable.find(e => e.position.x == (j - this.board.length / 2) * 20 && e.position.z == (i - this.board.length / 2) * 20)
          rotation = serverRotations[i][j]

        }
      }
    }
    if (foundPawn && rotation)
      foundPawn.rotation.y = rotation * Math.PI / 2 * -1
    this.pawns = serverPawns
    this.rotation = serverRotations

    if (foundPawn) {
      let oposite = 1
      if (Ui.player.len == 1)
        oposite = 2

      setTimeout(() => {
        this.laserShoot(oposite)
      }, 300)
    }
  }
  laserShoot = (player) => {
    setTimeout(() => {
      if (this.LaserBeam)
        this.removeFromScene(this.LaserBeam)
    }, 1000)
    this.LaserBeam = new LaserBeam({
      reflectMax: 10
    });
    if (player == 1) {
      this.LaserBeam.object3d.position.set(98, 30, 56.45555) //blue
      this.LaserBeam.intersect(
        new THREE.Vector3(-this.rotationLaserX, this.rotationLaserY, -this.rotationLaserZ),
        this.objectArray
      );
    } else if (player == 2) {
      this.LaserBeam.object3d.position.set(-79, 30, -82.35555) //red
      this.LaserBeam.intersect(
        new THREE.Vector3(this.rotationLaserX, this.rotationLaserY, this.rotationLaserZ),
        this.objectArray
      );
    }
    this.add2Scene(this.LaserBeam);

  }
  static win = (obj) => {
    let textWin = "win "
    if (obj.parent.children[0].name.includes("Blue"))
      textWin += "czerwony"
    if (obj.parent.children[0].name.includes("Red"))
      textWin += "niebieski"
    alert(textWin)
  }
  destroy = async (obj) => {
    this.pawns[(obj.parent.position.z + this.board.length * 10) / 20][(obj.parent.position.x + this.board.length * 10) / 20] = 0;


    console.log(obj)
    console.log("destry")
    for (let i = 0; i < obj.parent.children.length; i++) {
      let randX = Math.floor(Math.random() * (100 + 1)) - 50;
      let randY = Math.floor(Math.random() * (100 + 1)) - 50;
      let randZ = Math.floor(Math.random() * (100 + 1)) - 50;

      // obj.parent.children[i].position.x = await randX
      // obj.parent.children[i].position.z = await randY
      await WebGl.ssmoothyMove(obj.parent.children[i], {x: randX, y: randY, z: randZ});
    }
    setTimeout(() => {
      this.removeFromScene(this.LaserBeam)
      this.LaserBeam = undefined;
    }, 100)
    setTimeout(() => {
      // obj.parent.remove(obj.parent.children[i])
      obj.parent.parent.remove(obj.parent)
      this.socket.emit("removePawn", obj.parent.position)

    },2000)
    // console.log(obj.parent)
  }
  checkPlayerTurn = async () => {
    let turn = await this.net.getPlayerTurn()
    if (Game.playerTurn != turn)
      Game.playerTurn = turn

    setTimeout(this.checkPlayerTurn, 150)
  }
  static clearLaser() {
    setTimeout(() => {
      if (this.LaserBeam)
        this.removeFromScene(this.LaserBeam)
    }, 100)
  }
}

export default Game
