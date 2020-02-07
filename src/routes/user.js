const express = require('express')
const route = express.Router()
const user = require('../controller/user')
const validate = require('../middleware/user')
const {checkRole} = require('../middleware/authorization')

route.get("/", checkRole([0]), validate.gets, user.gets)
route.get("/:id", checkRole([0]), validate.get, user.get)
route.post("/", checkRole([0]), validate.post, user.post)
route.put("/:id", checkRole([0]), validate.put, user.put)
route.delete("/:id", checkRole([0]), validate.delete, user.delete)

module.exports = route
