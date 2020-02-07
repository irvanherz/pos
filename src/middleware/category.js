const path = require('path')
const fs = require('fs')
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
		//Sort options
		if(request.query.sort) {
			if(['name', 'date'].includes(request.query.sort) == false){
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
