const helper = require('../helper')
const jwt = require('jsonwebtoken')

module.exports = {
	authorization: (request, response, next) => {
        var authToken = request.get('Authorization')
        if(authToken && authToken.length){
            tokenArray = authToken.trim().match(/^Bearer\s(.+)$/)
            if(1 in tokenArray){
                const token = tokenArray[1]
                jwt.verify(token, 'RAHASIA', (error, decoded) => {
                    if(!error){
                        request.user = decoded
                        next()
                    } else {
                        return helper.response(response,400,error)
                    }
                })
            } else {
                return helper.response(response,400,new Error("Login token not valid."))
            }
        } else {
            return helper.response(response,400,new Error("Login token not supplied."))
        }
	}
}
