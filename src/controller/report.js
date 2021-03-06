const product = require('../model/report')
const helper = require('../helper/index')

module.exports = {
	gets: async (request, response) => {
		try {
			const result = await product.gets(request.query)
			return helper.response(response,200,result)
		} catch (error) {
			return helper.response(response,400,error)
		}
	},
	get: async (request, response) => {
		try {
			const result = await product.get(request.params.id, request.query)
			return helper.response(response,200,result)
		} catch (error) {
			return helper.response(response,400,error)
		}
	}
}
