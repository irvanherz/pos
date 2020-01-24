const product = require("../model/product")
const helper = require("../helper/index")
const mv = require('mv')
const fs = require('fs')
const path = require("path")

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
            const result = await product.get(request.params.id)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    post: async (request, response) => {
        try {
            const result = await product.post(request.body)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    put: async (request, response) => {
        try {
            var oldProduct = await product.get(request.params.id)
            var newProduct = await product.put(request.params.id, request.body)
            //check new image
            if(newProduct.image){
                mv(request.file.path, path.join(process.env.UPLOAD_PATH, request.file.filename),(err) => {
                    if(oldProduct.image){
                        fs.unlink(path.join(process.env.UPLOAD_PATH,oldProduct.image), (err) => {})
                    }
                })
                return helper.response(response,200,newProduct)
            }
            return helper.response(response,200,newProduct)
        } catch (error) {
           return helper.response(response,400,error)
        }
    },
    delete: async (request, response) => {
        try {
            const result = await product.delete(request.params.id)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    }
}
