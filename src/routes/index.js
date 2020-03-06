const express = require('express')
const route = express.Router()
const {authorization} = require('../middleware/authorization')

const productRoute = require('./product')
const categoryRoute = require('./category')
const authRoute = require('./auth')
const userRoute = require('./user')
const orderRoute = require('./order')
const reportRoute = require('./report')

route.use('/products', authorization, productRoute)
route.use('/products', authorization, reportRoute)
route.use('/categories', authorization, categoryRoute)
route.use('/auth', authRoute)
route.use('/users', authorization, userRoute)
route.use('/orders', authorization, orderRoute)

module.exports = route
