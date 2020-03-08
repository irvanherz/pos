const connection = require('../config/mysql')

module.exports = {
	gets: (params) => {
		//Filtering
		var where = []
		if (params.userId) {
			where.push(`(user_id=${params.userId})`)
		}
		if (params.dateStart) {
			where.push(`(DATE(created_at) >= '${params.dateStart}')`)
		}
		if (params.dateEnd) {
			where.push(`(DATE(created_at) <= '${params.dateEnd}')`)
		}
		var whereClause = (where.length) ? 'WHERE ' + where.join(' AND ') : ''
		//Sorting
		var sort = []
		sort[0] = 'updated_at'
		sort[1] = 'desc'

		if (params.sort) {
			const columns = { name: 'name', date: 'updated_at', price: 'price' }
			sort[0] = columns[params.sort]
		}
		if (params.order) {
			const orders = { asc: 'asc', desc: 'desc' }
			sort[1] = orders[params.order]
		}
		var orderClause = `ORDER BY ${sort[0]} ${sort[1]}`

		//Pagination
		var itemsPerPage = 10
		var currentPage = 1
		if (params.itemsPerPage) {
			itemsPerPage = params.itemsPerPage
		}
		if (params.page) {
			currentPage = params.page
		}
		var limit = [0, 10]
		limit[0] = (currentPage - 1) * itemsPerPage
		limit[1] = itemsPerPage
		const limitClause = `LIMIT ${limit[0]}, ${limit[1]}`

		return new Promise((resolve, reject) => {
			const query = `
				SELECT *
				FROM (SELECT a.*, b.name user_name, COUNT(*) AS count_items, SUM(c.qty) AS sum_items
						FROM order_session a
						LEFT JOIN user b ON a.user_id=b.id
						LEFT JOIN order_item c ON a.invoice_id=c.order_id
						GROUP BY a.invoice_id
					) x
					${whereClause} ${orderClause} ${limitClause}`
			connection.query(query, (error, result) => {
				if(!error){
					resolve(result)
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1301',
						message: 'Cannot read requested orders from database'
					})
				}
			})
		}).then(dataItems => {
			return new Promise((resolve, reject) => {
				const query = `SELECT COUNT(*) as found_rows
					FROM (SELECT a.*, b.name user_name, COUNT(*) AS count_items, SUM(c.qty) AS sum_items
						FROM order_session a
						LEFT JOIN user b ON a.user_id=b.id
						LEFT JOIN order_item c ON a.invoice_id=c.order_id
						GROUP BY a.invoice_id
					) x
					${whereClause}`
				connection.query(query, (error, result) => {
					if(!error){
						var totalItems = result[0].found_rows
						var totalPages = Math.ceil(totalItems / itemsPerPage)
						resolve({
							totalPages,
							currentPage,
							itemsPerPage,
							totalItems,
							items: dataItems
						})
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1301',
							message: 'Cannot read requested orders from database'
						})
					}
				})
			})
		})
	},
	get: (id) => {
		return new Promise((resolve, reject) => {
			connection.query(`
					SELECT *
					FROM (SELECT a.*, b.name user_name, COUNT(*) AS count_items, SUM(c.qty) AS sum_items
						FROM order_session a
						LEFT JOIN user b ON a.user_id=b.id
						LEFT JOIN order_item c ON a.invoice_id=c.order_id
						GROUP BY a.invoice_id
					) x
				WHERE id=?`
			, id, (error, result) => {
				if(!error){
					if(result.length == 1){
						resolve(result[0])
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1302',
							message: `Order ID ${id} not exists in database`
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1303',
						message: 'Cannot read requested order from database'
					})
				}
			})
		})
	},
	post: (setData) => {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO order_session SET ?', setData, (error, result) => {
				if(!error){
					const newResult = {id:result.insertId, ...setData}
					resolve(newResult)
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1304',
						message: 'Cannot write order into database'
					})
				}
			})
		})
	},
	put: (id, setData) => {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE order_session SET ? WHERE id=?', [setData,id], (error, result) => {
				if(!error){
					if(result.changedRows){
						const newResult = {id, ...setData}
						resolve(newResult)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1305',
							message: `Cannot update order ${id} to database`
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1306',
						message: 'Cannot update order to database'
					})
				}
			})
		})
	},
	delete: (id) => {
		return new Promise((resolve, reject) => {
			connection.query('DELETE FROM order_item WHERE order_id=?', id, (error, result) => {
				if(!error){
					if(result.affectedRows){
						resolve(result)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1002',
							message: 'Cannot delete order items from database'
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1002',
						message: 'Cannot delete order items from database'
					})
				}
			})
		})
			.then(() => {
				return new Promise((resolve, reject) => {
					connection.query('DELETE FROM order_session WHERE invoice_id=?', id, (error, result) => {
						if (!error) {
							if (result.affectedRows) {
								resolve({ id, message: 'Delete success' })
							} else {
								reject({
									code: 'DatabaseError',
									errno: '1002',
									message: 'Cannot delete order from database'
								})
							}
						} else {
							reject({
								code: 'DatabaseError',
								errno: '1002',
								message: 'Cannot delete item from database'
							})
						}
					})
				})
			})
	}
}
