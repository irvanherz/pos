const user = require("../model/user")
const helper = require("../helper/")
const jwt = require("jsonwebtoken")

module.exports = {
    signup: async (request, response) => {
        try {
            const result = await user.post(request.body)
            return helper.response(response,200,result)
        } catch (error) {
            return helper.response(response,400,error)
        }
    },
    signin: async (request, response) => {
        try {
            const result = await user.get(request.body.username, request.body.password)
            const loginData = {id:result.id, name:result.name, username:result.username, role:result.role}
            console.log(loginData);
            const token = jwt.sign(loginData,  "RAHASIA", {algorithm:"HS256", expiresIn: "7d", })
            return helper.response(response,200,{token})
        } catch (error) {
            return helper.response(response,400,error)
        }
    }
}
