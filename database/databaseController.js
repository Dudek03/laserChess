const data = require("../Data")
const Datastore = require('nedb')
const coll1 = new Datastore({
    filename: 'boards.db',
    autoload: true
})
coll1.loadDatabase()

module.exports = {

    getTabs: () => {
        console.log(data.finalBboard)
        console.log(typeof(data.finalBboard))
        coll1.find({id: parseInt(data.finalBboard) }, function (err, docs) {    
            console.log()
        })
    }

}