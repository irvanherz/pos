const connection = require('../config/mysql')

module.exports = {
	gets: (orderId) => {
		return new Promise((resolve, reject) => {
			connection.query(`
			SELECT 
			a.*, b.name product_name, b.image product_image, b.price product_price, b.description product_description,
			c.name category_name
				FROM order_item a 
				LEFT JOIN product b ON a.product_id=b.id
				LEFT JOIN category c ON b.category_id=c.id 
			WHERE order_id='${orderId}' ORDER BY updated_at ASC`, (error, result) => {
				if(!error){
					const finalResult = result.map(item => {
						item.product_image = item.product_image ? `${process.env.BASE_URL}/assets/${item.product_image}` : item.product_image
						return item
					})
					resolve(finalResult)
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1401',
						message: 'Cannot read requested order data of categories from database'
					})
				}
			})
		})
	},
	get: (orderId, itemId) => {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM order_item WHERE order_id=? AND id=?', [orderId,itemId], (error, result) => {
				if(result.length == 1){
					resolve(result[0])
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1402',
						message: `Item with ${orderId}:${itemId} not found.`
					})
				}
			})
		})
	},
	post: (orderId, setData) => {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO order_item SET ?', {order_id: orderId, ...setData}, (error, result) => {
				if(!error){
					const newResult = {id:result.insertId, order_id:orderId, ...setData}
					resolve(newResult)
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1403',
						message: 'Cannot write order data to database'
					})
				}
			})
		})
	},
	put: (orderId, itemId, setData) => {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE order_item SET ?,updated_at=CURRENT_TIMESTAMP WHERE order_id=? AND id=?', [setData, orderId, itemId], (error, result) => {
				if(!error){
					if(result.affectedRows){
						const newResult = {id:itemId, order_id:orderId, ...setData}
						resolve(newResult)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1401',
							message: 'Specified ID not found'
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1401',
						message: 'Cannot read order data from database'
					})
				}
			})
		})
	},
	delete: (orderId, itemId) => {
		return new Promise((resolve, reject) => {
			connection.query('DELETE FROM order_item WHERE order_id=? AND id=?', [orderId, itemId], (error, result) => {
				if(!error){
					if(result.affectedRows)
						resolve({id:itemId, message:'Delete OK'})
					else {
						reject({
							code: 'DatabaseError',
							errno: '1401',
							message: 'Order item ID doesnt exist'
						})
					}
				} else {
					reject(error)
				}
			})
		})
	}
}
