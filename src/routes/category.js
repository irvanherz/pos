const express = require('express')
const route = express.Router()
const category = require('../controller/category')
const validate = require('../middleware/category')

route.get("/", validate.gets, category.gets)
route.get("/:id", validate.get, category.get)
route.post("/", validate.post, category.post)
route.put("/:id", validate.put, category.put)
route.delete("/:id", validate.delete, category.delete)

module.exports = route
