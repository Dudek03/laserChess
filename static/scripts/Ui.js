//import Game from "./Game.js"
const Game = require("./Game")
class Ui {
    static player
    constructor() {
    }


    changeUIOnLog(userObj) {
        userObj = JSON.parse(userObj)
        document.getElementById("logged").innerHTML = userObj.user
        document.getElementById("loginWindow").style.fontSize = "xx-large"
        document.getElementById("loginWindow").innerText = "Oczekiwanie na drugiego gracza"
        //console.log(userObj, "change me")
        Ui.player = userObj
        if (Ui.player.len == 1) {
            Game.instance.camera.position.set(0, 40, 30)
            Game.instance.camera.lookAt(0, 0, 0)
        }
        else if (Ui.player.len == 2) {
            Game.instance.camera.position.set(0, 40, -30)
            Game.instance.camera.lookAt(0, 0, 0)
        }
        if (Ui.player.user == "Jesteś obserwatorem") {
            Game.instance.camera.position.set(0, 40, 0)
            Game.instance.camera.lookAt(0, 0, 0)
            Game.instance.camera.rotation.z += Math.PI / 2
        }
    }

    removeAlert() {
        document.getElementById("loginWindow").style.display = "none"
    }


}

module.exports = Ui
