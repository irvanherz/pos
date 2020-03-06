const category = require('../model/category')
const helper = require('../helper/index')

module.exports = {
	gets: async (request, response) => {
		try {
			const result = await category.gets(request.query)
			return helper.response(response,200,result)
		} catch (error) {
			return helper.response(response,400,error)
		}
	},
	get: async (request, response) => {
		try {
			const result = await category.get(request.params.id)
			return helper.response(response,200,result)
		} catch (error) {
			return helper.response(response,400,error)
		}
	},
	post: async (request, response) => {
		try {
			const result = await category.post(request.body)
			return helper.response(response,200,result)
		} catch (error) {
			return helper.response(response,400,error)
		}
	},
	put: async (request, response) => {
		try {
			const result = await category.put(request.params.id, request.body)
			return helper.response(response,200,result)
		} catch (error) {
			return helper.response(response,400,error)
		}
	},
	delete: async (request, response) => {
		try {
			const result = await category.delete(request.params.id)
			return helper.response(response,200,result)
		} catch (error) {
			return helper.response(response,400,error)
		}
	}
}
