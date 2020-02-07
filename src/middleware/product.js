const path = require('path')
const fs = require('fs')
const helper = require('../helper/')

module.exports = {
	gets: (request, response, next) => {
		var errors = []
		//Query filter
		if(request.query.search) {
			request.query.search = request.query.search.replace(/[^a-zA-z0-9-_ ]/,'')
			if(request.query.search < 3 || request.query.search > 20)
				errors.push(new Error(`Search query must be 3-20 characters.`))
		}
		//Category filter
		if(request.query.category) {
			if(/^[0-9]+$/.test(request.query.category) == false){
				errors.push(new Error(`Category filtering format is mismatch`))
			} else if(request.query.category < 1){
				errors.push(new Error(`Category parameter must be >= 1`))
			}
		}
		//Sort options
		if(request.query.sort) {
			if(['name', 'category', 'date', 'price'].includes(request.query.sort) == false){
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
		//Param ID
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response,400,new Error(`Invalid ID: '${request.params.id}'.`))
		}
		next()
	},
	post: (request, response, next) => {
		var errors = []

		//Remove unknown fields
		const fields = ['name','description','image','category_id','price']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		//Check name
		if(request.body.name !== undefined) {
			if(/^.{3,255}$/.test(request.body.name) == false)
				errors.push(new Error('Product name must be 3-255 characters.'))
		} else {
			errors.push(new Error('Product name is mandatory.'))
		}
		//Check description
		if(request.body.description !== undefined) {
			if(/^.{15,1000}$/.test(request.body.description) == false)
				errors.push(new Error('Product description must be 15-1000 characters.'))
		} else {
			errors.push(new Error('Product description is mandatory.'))
		}
		//Check image
		if(request.file){
			request.body.image = request.file.filename
		}
		//check price
		if(request.body.category_id !== undefined) {
			if(/^[0-9]{1,10}$/.test(request.body.category_id) == false){
				errors.push(new Error('Category id must be a number'))
			} else if(request.body.category_id < 1){
				errors.push(new Error('Invalid category_id'))
			}
		} else {
			errors.push(new Error('Category_id is mandatory'))
		}
		//check price
		if(request.body.price !== undefined) {
			if(/^[0-9]{1,10}$/.test(request.body.price) == false)
				errors.push(new Error('Product price is a number between 1-10 digits'))
		} else {
			errors.push(new Error('This field is mandatory'))
		}
		//result case
		if(errors.length > 0){
			return helper.response(response, 400, errors)
		} else{
			next()
		}
	},
	put: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, new Error('Invalid id.'))
		}

		var errors = []
		//remove unknown queries
		const fields = ['name','description','category_id','price']
		for (var field in request.body){
			if(fields.includes(field) == false){
				delete request.body[field]
			}
		}
		//check name
		if(request.body.name !== undefined) {
			if(/^.{3,100}$/.test(request.body.name) == false)
				errors.push(new Error('Product name must be 3-100 characters'))
		}
		//check description
		if(request.body.description !== undefined) {
			if(/^.{15,100}$/.test(request.body.description) == false)
				errors.push(new Error('Product description must be 15-100 chars.'))
		}
		//check image
		if(request.file){
			request.body.image = request.file.filename
		}
		//check price
		if(request.body.price !== undefined) {
			if(/^[0-9]{1,10}$/.test(request.body.price) == false)
				errors.push(new Error('Product price is a number between 1-10 digits'))
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
