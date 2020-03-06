const helper = require('../helper/')

module.exports = {
	gets: (request, response, next) => {
		var errors = []
		//Query filter
		if(request.query.search) {
			request.query.search = request.query.search.replace(/[^a-zA-z0-9-_ ]/,'')
			if(request.query.search < 3 || request.query.search > 20)
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid search query',
					field: 'query.search'
				})
		}
		//Category filter
		if(request.query.category) {
			if(/^[0-9]+$/.test(request.query.category) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid category filter query',
					field: 'query.category'
				})
			} else if(request.query.category < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid category filter query',
					field: 'query.category'
				})
			}
		}
		//Price filter
		if (request.query.minPrice) {
			if (/^[0-9]+$/.test(request.query.minPrice) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid minPrice filter query',
					field: 'query.minPrice'
				})
			}
		}
		if (request.query.maxPrice) {
			if (/^[0-9]+$/.test(request.query.maxPrice) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid maxPrice filter query',
					field: 'query.maxPrice'
				})
			}
		}
		//Sort options
		if(request.query.sort) {
			if(['name', 'category', 'date', 'price'].includes(request.query.sort) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: `Sort by '${request.query.sort}' is not supported.`,
					field: 'query.sort'
				})
			}
		}
		if(request.query.order) {
			if(['asc', 'desc'].includes(request.query.order) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: `Order by '${request.query.order}' is not supported.`,
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
					message: 'Invalid page query',
					field: 'query.page'
				})
			} else if(request.query.page < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid page query',
					field: 'query.page'
				})
			}
		}
		
		if(request.query.itemsPerPage) {
			if(/^[0-9]+$/.test(request.query.itemsPerPage) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid itemsPerPage query',
					field: 'query.itemsPerPage'
				})
			} else if(request.query.itemsPerPage < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid itemsPerPage query',
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
		//Param ID
		if(/^[0-9]+$/.test(request.params.id) == false){
			helper.response(response,400,{
				code: 'ValidationError',
				errno: '1000',
				message: `Invalid ID '${request.params.id}'.`,
				field: 'params.id'
			})
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
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Product name must be 3-255 characters',
					field: 'body.name'
				})
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Product name is mandatory',
				field: 'body.name'
			})
		}
		//Check description
		if(request.body.description !== undefined) {
			if(/^.{5,1000}$/.test(request.body.description) == false)
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Product description must be 5-1000 characters',
					field: 'body.description'
				})
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Product description is mandatory',
				field: 'body.description'
			})
		}
		//Check image
		if(request.file){
			request.body.image = request.file
		}
		//check price
		if(request.body.category_id !== undefined) {
			if(/^[0-9]{1,10}$/.test(request.body.category_id) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Category ID must be a number',
					field: 'body.category_id'
				})
			} else if(request.body.category_id < 1){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid category ID',
					field: 'body.category_id'
				})
			}
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Category ID cannot be empty',
				field: 'body.category_id'
			})
		}
		//check price
		if(request.body.price !== undefined) {
			if(/^[0-9]{1,10}$/.test(request.body.price) == false)
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Product price is must be a valid number',
					field: 'body.price'
				})
		} else {
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'Price cannot be empty',
				field: 'body.price'
			})
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
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1000',
				message: 'Invalid id',
				field: 'params.id'
			})
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
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Product name must be 3-100 characters',
					field: 'body.name'
				})
		}
		//check description
		if(request.body.description !== undefined) {
			if(/^.{5,1000}$/.test(request.body.description) == false)
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Product description must be 5-1000 chars',
					field: 'body.price'
				})
		}
		//check image
		if(request.file){
			request.body.image = request.file
		}
		//check price
		if(request.body.price !== undefined) {
			if(/^[0-9]{1,10}$/.test(request.body.price) == false)
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Product price must be a number',
					field: 'body.price'
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
				errno: '1000',
				message: `Invalid ID '${request.params.id}'`,
				field: 'params.id'
			})
		}
		next()
	}
}
