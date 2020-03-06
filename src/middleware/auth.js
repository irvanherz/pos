const helper = require('../helper')
const crypto = require('crypto')

module.exports = {
	signup: (request, response, next) => {
		var errors = []
		
		const fields = ['username','password_1','password_2','name','role']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		
		if(request.body.name !== undefined){
			if(/^[a-zA-Z '-]{5,200}$/.test(request.body.name) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid name format'
				})
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Name not specified'
			})
		}
		
		if(request.body.username !== undefined){
			if(/^[0-9a-z_.]{3,100}$/.test(request.body.username) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid username format'
				})
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Username was not specified'
			})
		}
		if(request.body.role !== undefined){
			if(/^[0-9]+$/.test(request.body.role) == false){
				errors.push(new Error('Invalid role format'))
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Role was not specified'
			})
		}
		if(request.body.password_1 !== undefined){
			if(/^.{5,100}$/.test(request.body.password_1) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Password too short'
				})
			} else {
				if(request.body.password_2 !== undefined){
					if(request.body.password_1 != request.body.password_2){
						errors.push({
							code: 'ValidationError',
							errno: '1000',
							message: 'Password confirmation not equal'
						})
					} else {
						request.body.password = crypto.createHash('sha256').update(request.body.password_1).digest('hex')
						request.body.status = 0
						delete request.body.password_1
						delete request.body.password_2
					}
				} else {
					errors.push({
						code: 'ValidationError',
						errno: '1000',
						message: 'Password confirmation was not specified'
					})
				}
				
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Password was not specified'
			})
		}

		if(errors.length){
			helper.response(response,400,errors)
		} else {
			next()
		}
	},
	signin: (request, response, next) => {
		var errors = []
		
		//Sanitize
		const fields = ['username','password']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		//Check username
		if(request.body.username){
			if(/^[0-9a-z_.]{3,100}$/.test(request.body.username) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid username format'
				})
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Username field not provided'
			})
		}
		//Check password
		if(request.body.password !== undefined){
			if(/^.{5,100}$/.test(request.body.password) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid password format'
				})
			} else {
				request.body.password = crypto.createHash('sha256').update(request.body.password).digest('hex')
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Password field not provided'
			})
		}
		
		if(errors.length){
			helper.response(response,400,errors)
		} else {
			next()
		}
	}
}
