const express = require('express')
const route = express.Router()
const category = require('../controller/category')
const validate = require('../middleware/category')
const {checkRole} = require('../middleware/authorization')

route.get('/', validate.gets, category.gets)
route.get('/:id', validate.get, category.get)
route.post('/', checkRole([0]), validate.post, category.post)
route.put('/:id', checkRole([0]), validate.put, category.put)
route.delete('/:id', checkRole([0]), validate.delete, category.delete)

module.exports = route
