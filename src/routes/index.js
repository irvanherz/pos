const express = require("express");
const route = express.Router();
const {authorization} = require('../middleware/authorization')

const productRoute = require('./product')
const categoryRoute = require('./category')
const authRoute = require('./auth')
const orderRoute = require('./order')

route.use('/products', authorization, productRoute)
route.use('/categories', authorization, categoryRoute)
route.use('/auth', authRoute)
route.use('/orders', authorization, orderRoute)

module.exports = route
