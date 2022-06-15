import Ui from "./Ui.js"
class Net {
    constructor(socket) {
        this.ui = new Ui
        this.socket = socket
    }

    addPlayer(name) {
        this.socket.on("fullRoom", () => {
            this.ui.removeAlert()
            this.ui.displayBoardChoice()
          })
        this.socket.on("player", (data) => {
            this.ui.changeUIOnLog({len: data, user: name})
        })
        this.socket.emit("join", { login: name })
    }

    playerBoardChoice(data, name) {
        this.socket.emit("choosenMap", data)
    }

    removePlayer() {
        fetch("/removePlayers", { method: "POST" })
            .catch(error => console.log(error))
    }


    getPlayerTurn() {
        const res = fetch("/getTurn")
            .then(res => res.json())
            //.then(res => console.log(res))
            .catch(error => console.log(error))
        return res
    }
    removePawn(pos){
      const res = fetch("/removePawn", {method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(pos)})
          // .then(res => res.json())
          //.then(res => console.log(res))
          .catch(error => console.log(error))
      return res
    }
}

export default Net
