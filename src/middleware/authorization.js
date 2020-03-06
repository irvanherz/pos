const helper = require('../helper')
const jwt = require('jsonwebtoken')

module.exports = {
	authorization: (request, response, next) => {
		try{
			let authToken = request.get('Authorization')
			if (authToken) {
				let tokenArray = authToken.trim().match(/^Bearer\s(.+)$/)
				if (tokenArray.length == 2) {
					const token = tokenArray[1]
					jwt.verify(token, 'RAHASIA', (error, decoded) => {
						if (!error) {
							request.user = decoded
							next()
						} else {
							return helper.response(response, 400, {
								code: 'AuthError',
								errno: '7000',
								message: error
							})
						}
					})
				} else {
					return helper.response(response, 400, {
						code: 'AuthError',
						errno: '7001',
						message: 'Invalid login token'
					})
				}
			} else {
				return helper.response(response, 400, {
					code: 'AuthError',
					errno: '7002',
					message: 'Login token not supplied'
				})
			}
		} catch(error){
			return helper.response(response, 400, {
				code: 'AuthError',
				errno: '7003',
				message: 'Invalid login token'
			})
		}
		
	},
    
	checkRole: (roles) => {
		return (request, response, next) => {
			if(roles.includes(request.user.role)){
				next()
			} else {
				return helper.response(response,400,new Error('Your role doesn\'t have permission to access this endpoint.'))
			}
		}
	}
}
