import WebGl from "./WebGl.js"
//const Game = require("./Game")
class Ui {
    static player
    constructor() {
        this.start()
    }

    start(){
        document.getElementById("boardChoice").style.display = "none"
    }

    displayBoardChoice(){
        document.getElementById("boardChoice").style.display = "block"
    }

    waitForSecondPlayerChoice(){
        document.getElementById("boardChoice").style.display = "none"
        document.getElementById("loginWindow").style.display = "block"
        document.getElementById("loginWindow").style.fontSize = "xx-large"
        document.getElementById("loginWindow").innerText = "Oczekiwanie na wybór drugiego gracza"
    }

    changeUIOnLog(userObj) {
        userObj = JSON.parse(userObj)
        document.getElementById("logged").innerHTML = userObj.user
        document.getElementById("loginWindow").style.fontSize = "xx-large"
        document.getElementById("loginWindow").innerText = "Oczekiwanie na drugiego gracza"
        Ui.player = userObj
        if (Ui.player.len == 1) {
            WebGl.instance.camera.position.set(0, 180, 200)
            WebGl.instance.camera.lookAt(0, 0, 0)
        }
        else if (Ui.player.len == 2) {
            WebGl.instance.camera.position.set(0, 180, -200)
            WebGl.instance.camera.lookAt(0, 0, 0)
        }
        if (Ui.player.user == "Jesteś obserwatorem") {
            WebGl.instance.camera.position.set(0, 100, 0)
            WebGl.instance.camera.lookAt(0, 0, 0)
            WebGl.instance.camera.rotation.z += Math.PI / 2
        }
    }

    removeAlert() {
        document.getElementById("loginWindow").style.display = "none"
    }

}

export default Ui
