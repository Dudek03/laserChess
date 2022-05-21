const data = require("../Data")
const Datastore = require('nedb')
const coll1 = new Datastore({
  filename: 'boards.db',
  autoload: true
})
coll1.loadDatabase()

module.exports = {

  getTabs: async () => {
    console.log(data.finalBboard + "z")
    return new Promise((resolve, reject) => {

      coll1.find({
        id: parseInt(data.finalBboard)
      }, function(err, docs) {
        if (docs[0])
          resolve(docs[0])
        // console.log(docs[0].id)
      })
    })
  }

}
