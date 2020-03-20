const express = require('express')
const route = express.Router()
const payment = require('../controller/payment')
// const validate = require('../middleware/category')

route.post('/:orderId', payment.createMidtransTransaction)
route.post('/:orderId', payment.midtransNotification)

module.exports = route
