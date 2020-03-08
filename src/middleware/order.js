const helper = require('../helper/')


module.exports = {
	gets: (request, response, next) => {
		var errors = []
		//Filter date
		if (request.query.dateStart) {
			if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.query.dateStart) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid dateStart',
					field: 'query.dateStart'
				})
			}
		}
		if (request.query.dateEnd) {
			if (/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.query.dateEnd) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid dateEnd format',
					field: 'query.dateEnd'
				})
			}
		} 
		//Filter by user
		if (request.query.userId) {
			if (/^[0-9]+$/.test(request.query.userId) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid userId query',
					field: 'query.userId'
				})
			}
		}
		//Sort options
		if (request.query.sort) {
			if (['date', 'price'].includes(request.query.sort) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: `Sort by '${request.query.sort}' is not supported.`,
					field: 'query.sort'
				})
			}
		}
		if (request.query.order) {
			if (['asc', 'desc'].includes(request.query.order) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: `Order by '${request.query.order}' is not supported.`,
					field: 'query.order'
				})
			}
		}
		//Pagination
		if (request.query.page) {
			if (/^[0-9]+$/.test(request.query.page) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid page query',
					field: 'query.page'
				})
			} else if (request.query.page < 1) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid page query',
					field: 'query.page'
				})
			}
		}

		if (request.query.itemsPerPage) {
			if (/^[0-9]+$/.test(request.query.itemsPerPage) == false) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid itemsPerPage query',
					field: 'query.itemsPerPage'
				})
			} else if (request.query.itemsPerPage < 1) {
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid itemsPerPage query',
					field: 'query.itemsPerPage'
				})
			}
		}
		//Take a decision
		if(errors.length){
			return helper.response(response,400,errors)
		}
		next()
	},
	get: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1000',
				message: 'Invalid ID'
			})
		}
		next()
	},
	post: async (request, response, next) => {
		var errors = []
		
		if((request.body.orderItems !== undefined) && (request.body.orderItems.length)) {
			//delete invalid fields
			request.body.orderItems = request.body.orderItems.map((item) => {
				const fields = ['product_id','qty']
				for(var field in item){
					if(fields.includes(field) == false) delete item[field]
				}
				return item
			})
			var itemIds = []
			//checks each fields
			request.body.orderItems.forEach((value, index) => {
				//check product id
				if(value.product_id !== undefined) {
					if(/^[0-9]+$/.test(value.product_id) == false){
						errors.push({
							code: 'ValidationError',
							errno: '1000',
							message: `Invalid product id at index ${index}`
						})
					}
					//check duplicate
					if(itemIds.includes(value.product_id)){
						errors.push({
							code: 'ValidationError',
							errno: '1000',
							message: `Duplicate product id at index ${index}`
						})
					} else {
						itemIds.push(value.product_id)
					}
				} else {
					errors.push({
						code: 'ValidationError',
						errno: '1000',
						message: `Product id at index ${index} is not specified`
					})
				}
				//check qty
				if(value.qty) {
					if(/^[0-9]+$/.test(value.qty) == false){
						errors.push({
							code: 'ValidationError',
							errno: '1000',
							message: `Invalid qty at index ${index}`
						})
					} else if(value.qty < 1) {
						errors.push({
							code: 'ValidationError',
							errno: '1000',
							message: `Qty at index ${index} must >= 1`
						})
					}
				} else {
					errors.push({
						code: 'ValidationError',
						errno: '1000',
						message: `Product Qty at index ${index} is not specified`
					})
				}
			})
		} else {
			errors.push()
			errors.push({
				code: 'ValidationError',
				errno: '1000',
				message: 'No items ordered'
			})
		}
		if(errors.length){
			return helper.response(response, 400, errors)
		}
		else next()
	},
	put: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1000',
				message: 'Invalid ID'
			})
		}
		next()
	},
	delete: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, {
				code: 'ValidationError',
				errno: '1000',
				message: 'Invalid ID'
			})
		}
		next()
	}
}
