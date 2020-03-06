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
				errors.push({
					code: 'ValidationError',
					errno: '1100',
					message: 'Search query must be 3-20 characters',
					field: 'query.search'
				})
		}
		//Sort options
		if(request.query.sort) {
			if(['name', 'date'].includes(request.query.sort) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1100',
					message: `Sort by '${request.query.sort}' is not supported.`,
					field: 'query.sort'
				})
			}
		}
		if(request.query.order) {
			if(['asc', 'desc'].includes(request.query.order) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1100',
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
					errno: '1100',
					message: 'Page filtering format is mismatch',
					field: 'query.page'
				})
			} else if(request.query.page < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1100',
					message: 'Page parameter must be >= 1',
					field: 'query.page'
				})
			}
		}
		
		if(request.query.itemsPerPage) {
			if(/^[0-9]+$/.test(request.query.itemsPerPage) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1100',
					message: 'itemsPerPage must be a number',
					field: 'query.itemsPerPage'
				})
			} else if(request.query.itemsPerPage < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1100',
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
				errno: '1100',
				message: 'Invalid category ID',
				field: 'params.id'
			})
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
				errors.push({
					code: 'ValidationError',
					errno: '1100',
					message: 'Category name must be 3-100 characters',
					field: 'body.name'
				})
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1100',
				message: 'Category name is mandatory.',
				field: 'body.name'
			})
		}
		//Result case
		if(errors.length > 0){
			return helper.response(response, 400, errors)
		}
		next()
	},
	put: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1100',
				message: 'Invalid category ID',
				field: 'params.id'
			})
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
		if(request.body.name) {
			if(/^.{3,100}$/.test(request.body.name) == false)
				errors.push({
					code: 'ValidationError',
					errno: '1100',
					message: 'Category name must be 3-100 characters',
					field: 'body.name'
				})
		}
		//result case
		if(errors.length > 0){
			return helper.response(response, 400, errors)
		}
		else next()
	},
	delete: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1100',
				message: 'Invalid category ID',
				field: 'params.id'
			})
		}
		next()
	}
}
