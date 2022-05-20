import Net from "./Net.js"
import WebGl from "./WebGl.js"
import Ui from "./Ui.js"
class Game {
    static instance
    constructor() {
        Game.instance = this
        this.net = new Net
        this.webgl = new WebGl
        this.createListeners()
    }

    createListeners() {
        let playerChoice
        const possibleChoices = document.querySelectorAll(".choice")

        document.getElementById("logOn").addEventListener("click", () => {
            let name = document.getElementById("login").value
            let ui = new Ui()
            this.net.addPlayer(name)
            const checklogin = setInterval(async () => {
                //console.log(await net.checkPlayers())
                if ((await this.net.checkPlayers()).len == 2) {
                    clearInterval(checklogin)
                    //this.createPawns()
                    //this.getPawns()
                    //this.createRaycaster()
                    ui.removeAlert()
                    ui.displayBoardChoice()
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
            const checkBoardChoice = setInterval(async () => {
                //console.log(await net.checkPlayers())
                if ((await this.net.checkChosenBoardLen()).len == 2) {
                    clearInterval(checkBoardChoice)
                    //console.log("hihihha")
                    this.net.chooseFinalBoard()
                }
            }, 1000)
        })
    }

}

export default Game