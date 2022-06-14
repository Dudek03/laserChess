class Data{

    constructor(gameId, userId){
        this.gameId = gameId
        this.userTab = [userId]
        this.chosenBoards = []
        this.turn = true
        this.pawns
        this.finalBoard
        this.board
        this.rotation
    }
}

module.exports = Data
