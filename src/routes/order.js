const express = require('express')
const route = express.Router()
const order = require('../controller/order')
const validate = require('../middleware/order')

route.get("/", validate.gets, order.gets)
route.get("/:id", validate.get, order.get)
route.post("/", validate.post, order.post)
route.put("/:id", validate.put, order.put)
route.delete("/:id", validate.delete, order.delete)

module.exports = route
