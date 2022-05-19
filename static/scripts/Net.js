import Ui from "./Ui.js"
class Net {
    constructor(){
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

    playerBoardChoice(data){
        fetch("/playerBoardChoice", {method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({choice: data})})
            .then(res => res.text())
            .catch(err => console.log(err))
    }

    checkChosenBoardLen(){
        fetch("chosenBoardLen")
            .then(res => res.text())
            .then(res => console.log(res))
            .catch(err => console.log(err))
    }

}

export default Net