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
    }
}