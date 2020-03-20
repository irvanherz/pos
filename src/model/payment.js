const midtransClient = require('midtrans-client')

module.exports = {
	createMidtransTransaction: (orderData) => {
		const snap = midtransClient.Snap()
		snap.apiConfig.set({
			isProduction: false,
			serverKey: process.env.MIDTRANS_SERVER_KEY,
			clientKey: process.env.MIDTRANS_CLIENT_KEY
		})
		let parameter = {
			'transaction_details': {
				'order_id': orderData.order_id,
				'gross_amount': orderData.price
			}
		}
		return snap.createTransaction(parameter)
			.then((transaction) => {
				let redirectUrl = transaction.redirect_url
				orderData.redirect_url = redirectUrl
			})
	},
	midtransNotification: (notificationData) => {
		let apiClient = new midtransClient.Snap({
			isProduction: false,
			serverKey: process.env.MIDTRANS_SERVER_KEY,
			clientKey: process.env.MIDTRANS_CLIENT_KEY
		})

		apiClient.transaction.notification(notificationData)
			.then(
				statusResponse => {
					let orderId = statusResponse.order_id
					let transactionStatus = statusResponse.transaction_status
					let fraudStatus = statusResponse.fraud_status

					if (transactionStatus == 'capture') {
						if (fraudStatus == 'challenge') {
							return {orderId, status: 'CHALLENGE'}
						} else if (fraudStatus == 'accept') {
							return { orderId, status: 'PAID' }
						} else if (fraudStatus == 'deny') {
							return { orderId, status: 'FAILURE' }
						}
					} else if (transactionStatus == 'cancel' ||
					transactionStatus == 'deny' ||
					transactionStatus == 'expire') {
						return { orderId, status: 'FAILURE' }
					} else if (transactionStatus == 'pending') {
						return { orderId, status: 'PENDING' }
					}
				}
			)
	}
}
