const payment = require('../model/payment')
const order = require('../model/order')
const helper = require('../helper')

module.exports = {
	createMidtransTransaction: async (request, response) => {
		try{
			const orderId = request.params.orderId
			const orderData = await order.get(orderId)
			const paymentData = await payment.createMidtransTransaction(orderData)
			helper.response(response, 200, paymentData)
		} catch(error){
			helper.response(response, 400, error)
		}
		
	},
	midtransNotification: async (request, response) => {
		try {
			const transaction = await payment.midtransNotification(request.body)
			await order.put(transaction.orderId, {status: transaction.status})
			helper.response(response, 200, 'OK')
		} catch (error) {
			helper.response(response, 400, error)
		}
	}
}