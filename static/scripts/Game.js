// import Net from "./Net"
// import WebGl from "./WebGl.js"
const Net = require("./Net")
const WebGl = require("./WebGl")
class Game {
    static instance
    constructor(){
        Game.instance = this
        this.net = new Net
        this.webgl = new WebGl
    }




    createListeners() {

        document.getElementById("logOn").addEventListener("click", () => {
            let name = document.getElementById("login").value
            //let net = new Net()
            let ui = new Ui()
            this.net.addPlayer(name)
            const check = setInterval(async () => {
                //console.log(await net.checkPlayers())
                if ((await this.net.checkPlayers()).len == 2) {
                    clearInterval(check)
                    //this.createPawns()
                    this.getPawns()
                    this.createRaycaster()
                    ui.removeAlert()
                }
            }, 1000)
        })

        document.getElementById("reset").addEventListener("click", () => {
            //let net = new Net()
            this.net.removePlayer()
        })

    }
    
}

module.exports = Game