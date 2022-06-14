
module.exports = {
    chooseFinalBoard: (data) => {
        let res
        let firstPlayerChoice = data.chosenBoards[0]
        let secondPlayerChoice = data.chosenBoards[1]
        if (firstPlayerChoice == secondPlayerChoice && firstPlayerChoice == 'random')
            res = Math.floor(Math.random() * 6) + 1

        else if (firstPlayerChoice == secondPlayerChoice && firstPlayerChoice != 'random')
            res = data.chosenBoards[0]

        else if (firstPlayerChoice != secondPlayerChoice && firstPlayerChoice != 'random' && secondPlayerChoice != 'random') {
            let temp = Math.floor(Math.random() * 2)
            res = data.chosenBoards[temp]
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
        data.finalBoard = res
        console.log(res)
        console.log(data)
        return [res]
    },

    playerMove: (pos, data) => {
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
    removePawn: (pos, data) => {
        data.pawns[(pos.z + data.board.length * 10) / 20][(pos.x + data.board.length * 10) / 20] = 0
    },

    restartGame: () => {
        data.userTab = []
        data.board = null
        data.pawns = null
        data.rotation = null
        data.turn = true
        data.chosenBoards = []
        data.finalBboard = 0

    }
}
