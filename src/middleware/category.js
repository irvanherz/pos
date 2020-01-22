const path = require('path')
const fs = require('fs')
const helper = require('../helper/')


module.exports = {
	gets: (request, response, next) => {
		var errors = []

		if(request.query.sort !== undefined) {
			if(['name', 'date'].includes(request.query.sort) == false){
				errors.push(new Error(`Sort by '${request.query.sort}' is not supported.`))
			}
		}

		if(request.query.order !== undefined) {
			if(['asc', 'desc'].includes(request.query.order) == false){
				errors.push(new Error(`Order '${request.query.order}' is not supported.`))
			}
		}

		if(request.query.limit !== undefined) {
			if(/^[0-9]+$/.test(request.query.limit) == false){
				errors.push(new Error(`Limit must be a number.`))
			}
		}

		if(request.query.offset !== undefined) {
			if(/^[0-9]+$/.test(request.query.limit) == false)
				errors.push(new Error(`Offset must be a number.`))
		}
		
		if(errors.length){
			return helper.response(response,400,errors)
		}
		next()
	},
	get: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response,400,new Error('Invalid id.'))
		}
		next()
	},
	post: (request, response, next) => {
		var errors = []
		//Remove unknown fields
		const fields = ['name']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		//Check name
		if(request.body.name !== undefined) {
			if(/^.{3,100}$/.test(request.body.name) == false)
				errors.push(new Error('Category name must be 3-100 characters.'))
		} else {
			errors.push(new Error('Category name is mandatory.'))
        }
		//Result case
		if(errors.length > 0){
			return helper.response(response, 400, errors)
        }
		next()
	},
	put: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, new Error('Invalid id.'))
		}

		var errors = []
		//remove unknown queries
		const fields = ['name']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		//check name
		if(request.body.name !== undefined) {
			if(/^.{3,100}$/.test(request.body.name) == false)
				errors.push(new Error('Category name must be 3-100 characters'))
		}
		//result case
		if(errors.length > 0){
			return helper.response(response, 400, errors)
		}
		else next()
	},
	delete: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, new Error('Invalid id.'))
		}
		next()
	}
}
