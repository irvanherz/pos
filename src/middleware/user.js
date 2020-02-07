const path = require('path')
const fs = require('fs')
const crypto = require('crypto')
const helper = require('../helper/')


module.exports = {
	gets: (request, response, next) => {
        var errors = []

        //Query name filter
		if(request.query.search) {
			request.query.search = request.query.search.replace(/[^a-zA-z0-9-_ ]/,'')
			if(request.query.search < 3 || request.query.search > 20)
				errors.push(new Error(`Search query must be 3-20 characters.`))
		}
		//Role filter
		if(request.query.role) {
			if(/^[0-9]+$/.test(request.query.role) == false){
				errors.push(new Error(`Role filtering format is mismatch`))
			} else if(request.query.category < 1){
				errors.push(new Error(`Role parameter must be >= 1`))
			}
		}
		//Status filter
		if(request.query.status) {
			if(/^[0-9]+$/.test(request.query.status) == false){
				errors.push(new Error(`Status filtering format is mismatch`))
			} else if(request.query.category < 1){
				errors.push(new Error(`Status parameter must be >= 1`))
			}
		}
		//Sort options
		if(request.query.sort) {
			if(['name', 'username', 'date'].includes(request.query.sort) == false){
				errors.push(new Error(`Sort by '${request.query.sort}' is not supported.`))
			}
		}
		if(request.query.order !== undefined) {
			if(['asc', 'desc'].includes(request.query.order) == false){
				errors.push(new Error(`Sort order '${request.query.order}' is not supported.`))
			}
		}
		//Pagination
		if(request.query.page) {
			if(/^[0-9]+$/.test(request.query.page) == false){
				errors.push(new Error(`Page filtering format is mismatch`))
			} else if(request.query.page < 1){
				errors.push(new Error(`Page parameter must be >= 1`))
			}
		}
		
		if(request.query.itemsPerPage) {
			if(/^[0-9]+$/.test(request.query.itemsPerPage) == false){
				errors.push(new Error(`itemsPerPage must be a number.`))
			} else if(request.query.itemsPerPage < 1){
				errors.push(new Error(`itemsPerPage parameter must be >= 1`))
			}
		}
		//Take a decission
		if(errors.length){
			return helper.response(response,400,errors)
		} else {
			next()
		}
	},
	get: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
            return helper.response(response,400,new Error('Invalid id.'))
		}
		next()
	},
	post: (request, response, next) => {
		var errors = []
		//Sanitize
		const fields = ['username','password_1','password_2','name','role']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		//Check name
		if(request.body.name !== undefined){
			if(/^[a-zA-Z '-]{5,200}$/.test(request.body.name) == false){
				errors.push(new Error('Invalid name format'))
			}
		} else {
			errors.push(new Error('Name not specified'))
		}
		//Check username
		if(request.body.username !== undefined){
			if(/^[0-9a-z_.]{3,100}$/.test(request.body.username) == false){
				errors.push(new Error('Invalid username format'))
			}
		} else {
			errors.push(new Error('Username was not specified'))
        }
        //Check role
		if(request.body.role !== undefined){
			if(/^[0-9]+$/.test(request.body.role) == false){
				errors.push(new Error('Invalid role format'))
			}
		} else {
			errors.push(new Error('Role was not specified'))
        }
        //Check password
		if(request.body.password_1 !== undefined){
			if(/^.{5,100}$/.test(request.body.password_1) == false){
				errors.push(new Error('Password too short'))
			} else {
				if(request.body.password_2 !== undefined){
					if(request.body.password_1 != request.body.password_2){
						errors.push(new Error('Password confirmation not equal'))
					} else {
						request.body.password = crypto.createHash('sha256').update(request.body.password_1).digest('hex')
						request.body.status = 1
						delete request.body.password_1
						delete request.body.password_2
					}
				} else {
					errors.push(new Error('Password confirmation was not specified'))
				}
			}
		} else {
			errors.push(new Error('Password was not specified'))
		}

		if(errors.length){
			helper.response(response,400,errors)
		} else {
			next()
		}
	},
	put: (request, response, next) => {
		var errors = []
        
        if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, new Error('Invalid id.'))
        }
        //Sanitize fields
		const fields = ['username','password_1','password_2','name','role', 'status']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
        }
        //Check name
		if(request.body.name){
			if(/^[a-zA-Z '-]{5,200}$/.test(request.body.name) == false){
				errors.push(new Error('Invalid name format'))
			}
		}
		//Check username
		if(request.body.username){
			if(/^[0-9a-z_.]{3,100}$/.test(request.body.username) == false){
				errors.push(new Error('Invalid username format'))
			}
        }
        //Check role
		if(request.body.role){
			if(/^[0-9]+$/.test(request.body.role) == false){
				errors.push(new Error('Invalid role format'))
			}
        }
        //Check status
        if(request.body.status){
			if(/^[0-9]+$/.test(request.body.status) == false){
				errors.push(new Error('Invalid status format'))
			}
		}
		if(request.body.password_1){
			if(/^.{5,100}$/.test(request.body.password_1) == false){
				errors.push(new Error('Password too short'))
			} else {
				if(request.body.password_2){
					if(request.body.password_1 != request.body.password_2){
						errors.push(new Error('Password confirmation not equal'))
					} else {
						request.body.password = crypto.createHash('sha256').update(request.body.password_1).digest('hex')
						delete request.body.password_1
						delete request.body.password_2
					}
				} else {
					errors.push(new Error('Password confirmation was not specified'))
				}
				
			}
		}

		if(errors.length){
			helper.response(response,400,errors)
		} else {
			next()
		}
	},
	delete: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, new Error('Invalid id.'))
		}
		next()
	}
}
