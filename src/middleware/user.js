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
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Search query must be 3-20 characters.',
					field: 'query.search'
				})
		}
		//Role filter
		if(request.query.role) {
			if(/^[0-9]+$/.test(request.query.role) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Role filtering format is mismatch' ,
					field: 'query.role'
				})
			} else if(request.query.category < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Role parameter must be >= 1',
					field: 'query.role'
				})
			}
		}
		//Status filter
		if(request.query.status) {
			if(/^[0-9]+$/.test(request.query.status) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Status filtering format is mismatch',
					field: 'query.status'
				})
			}
		}
		//Sort options
		if(request.query.sort) {
			if(['name', 'username', 'date'].includes(request.query.sort) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: `Sort by '${request.query.sort}' is not supported.`,
					field: 'query.sort'
				})
			}
		}
		if(request.query.order !== undefined) {
			if(['asc', 'desc'].includes(request.query.order) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: `Sort order '${request.query.order}' is not supported.`,
					field: 'query.order'
				})
			}
		}
		//Pagination
		if(request.query.page) {
			if(/^[0-9]+$/.test(request.query.page) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Page filtering format is mismatch',
					field: 'query.page'
				})
			} else if(request.query.page < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Page parameter must be >= 1',
					field: 'query.page'
				})
			}
		}
		
		if(request.query.itemsPerPage) {
			if(/^[0-9]+$/.test(request.query.itemsPerPage) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'itemsPerPage must be a number.' ,
					field: 'query.itemsPerPage'
				})

			} else if(request.query.itemsPerPage < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'itemsPerPage parameter must be >= 1',
					field: 'query.itemsPerPage'
				})
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
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1000',
				message: 'Invalid ID',
				field: 'params.id'
			})
		}
		next()
	},
	post: (request, response, next) => {
		var errors = []
		//Sanitize
		const fields = ['username', 'password_1', 'password_2', 'name', 'photo', 'role']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		//Check name
		if(request.body.name !== undefined){
			if(/^[a-zA-Z '-]{5,200}$/.test(request.body.name) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid name format',
					field: 'body.name'
				})
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Name not specified',
				field: 'body.name'
			})
		}
		//Check username
		if(request.body.username !== undefined){
			if(/^[0-9a-z_.]{3,100}$/.test(request.body.username) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid username format',
					field: 'body.username'
				})
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Username was not specified',
				field: 'body.username'
			})
		}
		//check image
		if (request.file) {
			request.body.photo = request.file
		}
		//Check role
		if(request.body.role){
			if(/^[0-9]+$/.test(request.body.role) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid role format',
					field: 'body.role'
				})
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Role was not specified',
				field: 'body.role'
			})
		}
		//Check password
		if(request.body.password_1 !== undefined){
			if(/^.{5,100}$/.test(request.body.password_1) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Password too short',
					field: 'body.password_1'
				})
			} else {
				if(request.body.password_2 !== undefined){
					if(request.body.password_1 != request.body.password_2){
						errors.push({
							code: 'ValidationError',
							errno: '1000',
							message: 'Password confirmation not equal',
							field: 'body.password_2'
						})
					} else {
						request.body.password = crypto.createHash('sha256').update(request.body.password_1).digest('hex')
						request.body.status = 1
						delete request.body.password_1
						delete request.body.password_2
					}
				} else {
					errors.push({
						code: 'ValidationError',
						errno: '1000',
						message: 'Password confirmation was not specified',
						field: 'body.password_2'
					})
				}
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Password was not specified',
				field: 'body.password_1'
			})
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
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1000',
				message: 'Invalid ID',
				field: 'params.id'
			})
		}
		//Sanitize fields
		const fields = ['username','old_password', 'password_1','password_2','name', 'photo', 'role', 'status']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		//Check name
		if(request.body.name){
			if(/^[a-zA-Z '-]{5,200}$/.test(request.body.name) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid name format',
					field: 'body.name'
				})
			}
		}
		//Check username
		if(request.body.username){
			if(/^[0-9a-z_.]{3,100}$/.test(request.body.username) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid username format',
					field: 'body.username'
				})
			}
		}
		//Check photo
		if (request.file) {
			request.body.photo = request.file
		}
		//Check role
		if(request.body.role){
			if(/^[0-9]+$/.test(request.body.role) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid role format',
					field: 'body.role'
				})
			}
		}
		//Check status
		if(request.body.status){
			if(/^[0-9]+$/.test(request.body.status) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid status format',
					field: 'body.status'
				})
			}
		}
		if(request.body.password_1){
			if(/^.{5,100}$/.test(request.body.password_1) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Password too short',
					field: 'body.password_1'
				})
			} else {
				if(request.body.password_2){
					if(request.body.password_1 != request.body.password_2){
						errors.push({
							code: 'ValidationError',
							errno: '1000',
							message: 'Password confirmation not equal',
							field: 'body.password_2'
						})
					} else {
						if(request.body.old_password){
							request.body.old_password = crypto.createHash('sha256').update(request.body.old_password).digest('hex')
							request.body.password = crypto.createHash('sha256').update(request.body.password_1).digest('hex')
							delete request.body.password_1
							delete request.body.password_2
						} else {
							errors.push({
								code: 'ValidationError',
								errno: '1000',
								message: 'Old password was not specified',
								field: 'body.old_password'
							})
						}
					}
				} else {
					errors.push({
						code: 'ValidationError',
						errno: '1000',
						message: 'Password confirmation was not specified',
						field: 'body.password_2'
					})
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
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1000',
				message: 'Invalid ID',
				field: 'params.id'
			})
		}
		next()
	}
}
