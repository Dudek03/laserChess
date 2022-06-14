const Datastore = require('nedb')
const coll1 = new Datastore({
  filename: 'boards.db',
  autoload: true
})
coll1.loadDatabase()

module.exports = {

  getTabs: async (data) => {
    console.log(data.finalBoard + "z")
    return new Promise((resolve, reject) => {
      coll1.find({
        id: parseInt(data.finalBoard)
      }, function (err, docs) {
        if (docs[0])
          resolve(docs[0])
      })
    })
  }

}
