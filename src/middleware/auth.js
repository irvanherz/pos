const helper = require('../helper')

module.exports = {
	signup: (request, response, next) => {
		var errors = []
		
		const fields = ['username','password','name','role','status']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}

		if(request.body.username !== undefined){
			if(/^[0-9a-z_.]{3,100}$/.test(request.body.username) == false){
				errors.push(new Error('Invalid username format'))
			}
		} else {
			errors.push(new Error('Username was not specified'))
		}
		if(request.body.password !== undefined){
			if(/^.{5,100}$/.test(request.body.password) == false){
				errors.push(new Error('Invalid password format'))
			}
		} else {
			errors.push(new Error('Password was not specified'))
		}
		if(request.body.role !== undefined){
			if(/^[0-9]+$/.test(request.body.role) == false){
				errors.push(new Error('Invalid role format'))
			}
		} else {
			errors.push(new Error('Role was not specified'))
		}
		if(request.body.status !== undefined){
			if(/^[0-9]+$/.test(request.body.status) == false){
				errors.push(new Error('Invalid status format'))
			}
		} else {
			errors.push(new Error('Status was not specified'))
		}

		if(errors.length){
			helper.response(response,400,errors)
		} else {
			next()
		}
	},
	signin: (request, response, next) => {
		var errors = []
		
		const fields = ['username','password']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		if(request.body.username !== undefined){
			if(/^[0-9a-z_.]{3,100}$/.test(request.body.username) == false){
				errors.push(new Error('Invalid username format'))
			}
		} else {
			errors.push(new Error('Username field not provided'))
		}
		if(request.body.password !== undefined){
			if(/^.{5,100}$/.test(request.body.password) == false){
				errors.push(new Error('Invalid password format'))
			}
		} else {
			errors.push(new Error('Password field not provided'))
		}
		
		if(errors.length){
			helper.response(response,400,errors)
		} else {
			next()
		}
	}
}
