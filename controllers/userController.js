const data = require("../Data")
module.exports = {

    add: (req) => {
        let ans = {}
        if (data.userTab.length < 2) {
            data.userTab.push(req.body)
            ans.len = data.userTab.length
            ans.user = data.userTab[data.userTab.length - 1].login
            return ans
        }
        else {
            ans.user = "Jesteś obserwatorem"
            return ans
        }
    },

    checkTabLength: () => {
        let ans = {}
        ans.len = data.userTab.length
        return JSON.stringify(ans)
    },

    addPlayerBoardChoice: (req) => {
        //let temp = JSON.parse(data)
        let found = data.chosenBoards.find(e => e.login == req.login)
        if (found) return
        //console.log(req)
        data.chosenBoards.push(req)
        console.log(data.chosenBoards)
    },

    checkChosenBoardLen: () => {
        let ans = {}
        ans.len = data.chosenBoards.length
        return JSON.stringify(ans)
    },

    chooseFinalBoard: () => {
        let res
        let firstPlayerChoice = data.chosenBoards[0].choice
        let secondPlayerChoice = data.chosenBoards[1].choice
        if (firstPlayerChoice == secondPlayerChoice && firstPlayerChoice == 'random' && data.finalBboard == 0)
            res = Math.floor(Math.random() * 6) + 1

        else if (firstPlayerChoice == secondPlayerChoice && firstPlayerChoice != 'random')
            res = data.chosenBoards[0].choice

        else if (firstPlayerChoice != secondPlayerChoice && firstPlayerChoice != 'random' && secondPlayerChoice != 'random') {
            let temp = Math.floor(Math.random() * 2)
            res = data.chosenBoards[temp].choice
        }

        else if (firstPlayerChoice != secondPlayerChoice && (firstPlayerChoice == 'random' || secondPlayerChoice == 'random')) {
            if (firstPlayerChoice == 'random')
                res = secondPlayerChoice
            else if (secondPlayerChoice == 'random')
                res = firstPlayerChoice
        }

        else if (data.finalBboard != 0) {
            res = data.finalBboard
        }
        data.finalBboard = res

        return [res]
    },

    playerMove: (pos) => {
        //console.log(pos)
        if (pos.newX == "none" && pos.newZ == "none") {
            data.rotation[pos.oldZ][pos.oldX] += pos.rotation
        }
        else if (pos.rotation == "none") {
            let modelNum = data.pawns[pos.oldZ][pos.oldX]
            data.pawns[pos.oldZ][pos.oldX] = 0
            data.pawns[pos.newZ][pos.newX] = modelNum
        }
        if(pos.color == "Red" && data.turn == false)
            data.turn = true
        else if(pos.color == "Blue" && data.turn == true)
            data.turn = false
    },
    removePawn: (pos) => {
      // data.pawns[(pos.z + data.board.length * 10) / 20][(pos.x + data.board.length * 10) / 20] = 0
    }
}
