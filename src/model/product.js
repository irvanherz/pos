const connection = require('../config/mysql')
const process = require('process')
const fsx = require('fs-extra')
const path = require('path')

module.exports = {
	gets: (params) => {
		//Filtering
		var where = []
		if (params.search) {
			where.push(`((a.name LIKE '${params.search}%') OR (a.name LIKE '%${params.search}') OR (a.name LIKE '%${params.search}%'))`)
		}
		if (params.category) {
			where.push(`(a.category_id=${params.category})`)
		}
		if (params.minPrice) {
			where.push(`(a.price>=${params.minPrice})`)
		}
		if (params.maxPrice) {
			where.push(`(a.price<=${params.maxPrice})`)
		}
		var whereClause = (where.length) ? 'WHERE ' + where.join(' AND ') : ''
		//Sorting
		var sort = []
		sort[0] = 'a.updated_at'
		sort[1] = 'desc'

		if (params.sort) {
			const columns = { name: 'a.name', category: 'a.category', date: 'a.updated_at', price: 'a.price' }
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
                SELECT SQL_CALC_FOUND_ROWS
                    a.*, b.name AS category_name
                FROM product AS a
                JOIN category AS b ON a.category_id=b.id 
                ${whereClause} ${orderClause} ${limitClause}`

			connection.query(query, (error, result) => {
				if(!error){
					resolve(result)
				} else {
					reject({
						code:'DatabaseError',
						errno: '1001',
						message: 'Cannot read requested products from database'
					})
				}
			})
		}).then(products => {
			return new Promise((resolve, reject) => {
				connection.query('SELECT FOUND_ROWS() as found_rows', (error, result) => {
					if(!error){
						var totalItems = result[0].found_rows
						var totalPages = Math.ceil(totalItems / itemsPerPage)
						const finalItems = products.map(item => {
							if (item.image) {
								item.image = `${process.env.BASE_URL}/assets/${item.image}`
								return item
							} else return item
						})
						const finalResult = {
							totalPages,
							currentPage,
							itemsPerPage,
							totalItems,
							items: finalItems
						}
						resolve(finalResult)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1002',
							message: 'Cannot read requested products from database'
						})
					}
				})
			})
		})
	},
	get: (id) => {
		return new Promise((resolve, reject) => {
			connection.query(`
                    SELECT a.*,b.name AS category_name
                    FROM product AS a
                    JOIN category AS b ON a.category_id=b.id WHERE a.id=?`,
			id, (error, result) => {
				if(!error){
					if(result.length > 0){
						resolve(result[0])
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1003',
							message: `Product ID ${id} does not exist`
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1004',
						message: 'Cannot read requested product from database'
					})
				}
			})
		}).then(product => {
			if (product.image) {
				product.image = `${process.env.BASE_URL}/assets/${product.image}`
			}
			return product
		})
	},
	post: (setData) => {
		return new Promise((resolve, reject) => {
			if (setData.image) {
				const src = setData.image.path
				const dest = path.join(process.env.UPLOAD_PATH, setData.image.filename)
				return fsx.move(src, dest).then(() => {
					setData.image = setData.image.filename
					resolve(setData)
				}).catch(() => {
					reject({
						code: 'UploadError',
						errno: '1005',
						message: 'Unable to move uploaded file from temporary to upload folder.'
					})
				})
			} else {
				resolve(setData)
			}
		}).then(postData => {
			return new Promise((resolve, reject) => {
				connection.query('INSERT INTO product SET ?', postData, (error, result) => {
					if (!error) {
						const product = { id: result.insertId, ...setData }
						resolve(product)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1006',
							message: 'Cannot write product to database'
						})
					}
				})
			})
		})
	},
	put: (id, setData) => {
		let oldProduct = undefined
		return new Promise((resolve, reject) => { //read old product
			connection.query('SELECT * FROM product WHERE id=?', [id], (error, result) => {
				if(!error){
					if (result.length > 0) {
						oldProduct = result[0]
						resolve()
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1007',
							message: `Product ID ${id} does not exist`
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1008',
						message: 'Cannot read database'
					})
				}
			})
		}).then(() => { //move image
			if (setData.image){
				const src = setData.image.path
				const dest = path.join(process.env.UPLOAD_PATH, setData.image.filename)
				setData.image = setData.image.filename
                
				return fsx.move(src, dest)
					.then(() => {
						return
					}).catch(() => {
						throw({
							code: 'UploadError',
							errno: '1009',
							message: 'Could not move uploaded image'
						})
					})
			} else {
				return
			}
		}).then(() => { //update
			return new Promise((resolve, reject) => {
				connection.query('UPDATE product SET ? WHERE id=?', [setData, id], (error, result) => {
					if (!error) {
						const newProduct = { id, ...setData }
						resolve(newProduct)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1010',
							message: `Could not update product ID ${id}`
						})
					}
				})
			})
		}).then((newProduct) => { //need delete?
			if(setData.image && oldProduct.image){
				const oldImage = path.join(process.env.UPLOAD_PATH, oldProduct.image)
				return fsx.unlink(oldImage).then(() => {
					return newProduct
				}).catch(() => {
					return newProduct
				})
			} else {
				return newProduct
			}
		})
	},
	delete: (id) => {
		let oldProduct = undefined

		return new Promise((resolve, reject) => { //read old product
			connection.query('SELECT * FROM product WHERE id=?', [id], (error, result) => {
				if (!error) {
					if (result.length > 0) {
						oldProduct = result[0]
						resolve()
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1011',
							message: `Product ID ${id} does not exist`
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1012',
						message: 'Cannot read database'
					})
				}
			})
		}).then (() => {
			return new Promise((resolve, reject) => {
				connection.query('DELETE FROM product WHERE id=?', id, (error, result) => {
					if (!error) {
						if (result.affectedRows){
							resolve({ id, message: 'Delete success' })
						} else {
							reject({
								code: 'DatabaseError',
								errno: '1013',
								message: `Product ID ${id} does not exist`
							})
						}
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1014',
							message: 'Cannot delete product from database.'
						})
					}
				})
			})
		}).then((result) => {
			if(oldProduct.image){
				const oldImage = path.join(process.env.UPLOAD_PATH, oldProduct.image)
				fsx.unlink(oldImage).then(() => {
					return result
				}).catch(() => {
					return result
				})
			} else {
				return result
			}
		})
	}
}
