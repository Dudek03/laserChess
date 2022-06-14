import Ui from "./Ui.js"
class Net {
    constructor() {
        this.ui = new Ui
    }

    addPlayer(name) {
        fetch("/addPlayer", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ login: name }) })
            .then(res => res.text())
            //.then(res => console.log(res))
            .then(res => {
                this.ui.changeUIOnLog(res)
            })
            .catch(error => console.log(error))
    }

    checkPlayers() {
        const res = fetch("/checkTabLen")
            .then(res => res.json())
            .catch(error => console.log(error))
        return res
    }

    playerBoardChoice(data, name) {
        fetch("/playerBoardChoice", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ choice: data, login: name }) })
            .then(res => res.text())
            .catch(err => console.log(err))
    }

    checkChosenBoardLen() {
        const res = fetch("/chosenBoardLen")
            .then(res => res.json())
            .catch(err => console.log(err))
        return res
    }

    chooseFinalBoard() {
        fetch("/chooseFinalBoard")
            .then(res => res.text())
            .then(res => console.log(res, "final board"))
            .catch(err => console.log(err))
    }

    getTables() {
        let data = fetch("/getTables")
            .then(res => res.json())
            .catch(err => console.log(err))
        return data;
    }

    removePlayer() {
        fetch("/removePlayers", { method: "POST" })
            .catch(error => console.log(error))
    }

    playerMove(pos){
        fetch("/playerMove", {method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(pos)})
            ///.then(res => res.json())
            //.then(res => console.log(res, "new tab"))
            .catch(error => console.log(error))
    }

    getPawnsPosition() {
        const res = fetch("/getPawns")
            .then(res => res.json())
            //.then(res => console.log(res))
            .catch(error => console.log(error))
        return res
    }

    getPawnsRotation() {
        const res = fetch("/getRotation")
            .then(res => res.json())
            //.then(res => console.log(res))
            .catch(error => console.log(error))
        return res
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
