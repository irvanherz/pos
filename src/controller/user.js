const user = require("../model/user")
const helper = require("../helper/index")

module.exports = {
    gets: async (request, response) => {
        try {
            const result = await user.gets(request.query)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    get: async (request, response) => {
        try {
            const result = await user.get(request.params.id)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    post: async (request, response) => {
        try {
            const result = await user.post(request.body)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    put: async (request, response) => {
        try {
            const result = await user.put(request.params.id, request.body)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    delete: async (request, response) => {
        try {
            const result = await user.delete(request.params.id)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    }
}
