const helper = require('../helper/')


module.exports = {
	gets: (request, response, next) => {
		var errors = []

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
			return helper.response(response,400,new Error('invalid id'))
		}
		next()
	},
	post: async (request, response, next) => {
		var errors = [];
		
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
						errors.push(new Error(`Invalid product id at index ${index}`))
					}
					//check duplicate
					if(itemIds.includes(value.product_id)){
						errors.push(new Error(`Duplicate product id at index ${index}`))
					} else {
						itemIds.push(value.product_id)
					}
				} else {
					errors.push(new Error(`Product id at index ${index} is not specified`))
				}
				//check qty
				if(value.qty !== undefined) {
					if(/^[0-9]+$/.test(value.qty) == false){
						errors.push(new Error(`Invalid qty at index ${index}`))
					} else if(value.qty < 1) {
						errors.push(new Error(`Qty at index ${index} must >= 1`))
					}
				} else {
					errors.push(new Error(`Product Qty at index ${index} is not specified`))
				}
			})
		} else {
			errors.push(new Error(`No items ordered.`))
		}
		if(errors.length){
			return helper.response(response, 400, errors)
		}
		else next()
	},
	put: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, new Error("ID format mismatch"))
		}
		next()
	},
	delete: (request, response, next) => {
		if(/^[0-9]+$/.test(request.params.id) == false){
			return helper.response(response, 400, new Error("ID format mismatch"))
		}
		next()
	}
}
