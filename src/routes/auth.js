const express = require('express')
const route = express.Router()
const auth = require('../controller/auth')
const validate = require('../middleware/auth')

route.post("/signup", validate.signup, auth.signup)
route.post("/signin", validate.signin, auth.signin)

module.exports = route
