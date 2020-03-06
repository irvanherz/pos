const user = require('../model/user')
const helper = require('../helper/')
const jwt = require('jsonwebtoken')

module.exports = {
	signup: async (request, response) => {
		try {
			const result = await user.post(request.body)
			return helper.response(response,200,result)
		} catch (error) {
			return helper.response(response,400,error)
		}
	},
	signin: async (request, response) => {
		try {
			const result = await user.login(request.body.username, request.body.password)
			if(result.status != 0){
				return helper.response(response,400,{
					code:'AuthError',
					errno: 7001,
					message:'Account not verified'
				})
			} else {
				const loginData = {...result}
				const token = 'Bearer ' + jwt.sign(loginData,  'RAHASIA', {algorithm:'HS256', expiresIn: '7d', })
				return helper.response(response,200,{...result, token})
			}
		} catch (error) {
			return helper.response(response,400,error)
		}
	}
}
