const connection = require('../config/mysql')
const process = require('process')
const fsx = require('fs-extra')
const path = require('path')

module.exports = {
	gets: (params) => {
		var where = []
		if (params.search) {
			where.push(`((name LIKE '${params.search}%') OR (name LIKE '%${params.search}') OR (name LIKE '%${params.search}%') OR (username LIKE '${params.search}%') OR (username LIKE '%${params.search}') OR (username LIKE '%${params.search}%'))`)
		}
		if (params.role) {
			where.push(`(role=${params.role})`)
		}
		if (params.status) {
			where.push(`(status=${params.status})`)
		}
		var whereClause = (where.length) ? 'WHERE ' + where.join(' AND ') : ''
		//Sorting
		var sort = []
		sort[0] = 'updated_at'
		sort[1] = 'desc'

		if (params.sort !== undefined) {
			const columns = { name: 'name', username: 'username', date: 'updated_at' }
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
			connection.query(`
                SELECT SQL_CALC_FOUND_ROWS * FROM user
                ${whereClause}
                ${orderClause}
                ${limitClause}`, (error1, result1) => {
				if(!error1){
					connection.query('SELECT FOUND_ROWS() as found_rows', (error2, result2) => {
						if(!error2){
							var totalItems = result2[0].found_rows
							var totalPages = Math.ceil(totalItems / itemsPerPage)
							const finalItems = result1.map(item => {
								if (item.photo) {
									item.photo = `${process.env.BASE_URL}/assets/${item.photo}`
									return item
								} else return item
							})
							resolve({
								totalPages,
								currentPage,
								itemsPerPage,
								totalItems,
								items: finalItems
							})
						} else {
							reject({
								code: 'DatabaseError',
								errno: '1002',
								message: 'Cannot read requested users from database'
							})
						}
                        
					})
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1002',
						message: 'Cannot read requested users from database'
					})
				}
			})
		})
	},
	get: (id) => {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM user WHERE id=?', id, (error, result) => {
				if (!error) {
					if(result.length == 1) {
						const finalResult = result[0]
						delete finalResult.password
						if (finalResult.photo) {
							finalResult.photo = `${process.env.BASE_URL}/assets/${finalResult.photo}`
						}
						resolve(finalResult)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1002',
							message: 'Cannot read requested users from database'
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1002',
						message: 'Cannot read requested users from database'
					})
				}
			}
			)
		})
	},
    
	verify: (id, password) => {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM user WHERE id=? AND password=?', 
				[id,password], (error, result) => {
					if (!error) {
						if(result.length == 1) {
							resolve(true)
						} else {
							resolve(false)
						}
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1002',
							message: 'Cannot read requested users from database'
						})
					}
				}
			)
		})
	},
	login: (username, password) => {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM user WHERE username=? AND password=? ', 
				[username, password], (error, result) => {
					if (!error) {
						if(result.length == 1) {
							const finalResult = result[0]
							delete finalResult.password
							if (finalResult.photo) {
								finalResult.photo = `${process.env.BASE_URL}/assets/${finalResult.photo}`
							}
							resolve(finalResult)
						} else {
							reject({
								code: 'DatabaseError',
								errno: '1002',
								message: 'Invalid username or password'
							})
						}
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1002',
							message: 'Cannot read requested users from database'
						})
					}
				}
			)
		})
	},
	post: (setData) => {
		return new Promise((resolve, reject) => {
			if (setData.photo) {
				const src = setData.photo.path
				const dest = path.join(process.env.UPLOAD_PATH, setData.photo.filename)
				return fsx.move(src, dest).then(() => {
					setData.photo = setData.photo.filename
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
				connection.query('INSERT INTO user SET ?', postData, (error, result) => {
					if (!error) {
						const user = { id: result.insertId, ...setData }
						delete user.password
						if(user.photo){
							user.photo = `${process.env.BASE_URL}/assets/${user.photo}`
						}
						resolve(user)
					} else {
						if (error.code == 'ER_DUP_ENTRY') {
							reject({
								code: 'DatabaseError',
								errno: '1002',
								message: 'Username already exist'
							})
						} else {
							reject({
								code: 'DatabaseError',
								errno: '1006',
								message: 'Cannot write user to database'
							})
						}
					}
				})
			})
		})
	},
	put: (id, setData) => {
		let oldUser = undefined
		return new Promise((resolve, reject) => { //read old user
			connection.query('SELECT * FROM user WHERE id=?', [id], (error, result) => {
				if (!error) {
					if (result.length > 0) {
						oldUser = result[0]
						resolve()
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1007',
							message: `User ID ${id} does not exist`
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1008',
						message: 'Cannot read user from database'
					})
				}
			})
		}).then(() => { //move photo? change password?
			if (setData.old_password) {
				if (setData.old_password != oldUser.password) {
					throw({
						code: 'DatabaseError',
						errno: '1008',
						message: 'Invalid old password'
					})
				}
				delete setData.old_password
			}
			if (setData.photo) {
				const src = setData.photo.path
				const dest = path.join(process.env.UPLOAD_PATH, setData.photo.filename)
				setData.photo = setData.photo.filename

				return fsx.move(src, dest)
					.then(() => {
						return
					}).catch(() => {
						throw ({
							code: 'UploadError',
							errno: '1009',
							message: 'Could not move uploaded photo'
						})
					})
			} else {
				return
			}
		}).then(() => { //update
			return new Promise((resolve, reject) => {
				connection.query('UPDATE user SET ? WHERE id=?', [setData, id], (error, result) => {
					if (!error) {
						const newUser = { id, ...setData }
						resolve(newUser)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1010',
							message: `Could not update user ID ${id}`
						})
					}
				})
			})
		}).then((newUser) => { //need delete?
			if (newUser.photo) {
				newUser.photo = `${process.env.BASE_URL}/assets/${newUser.photo}`
			}
			if (setData.photo && oldUser.photo) {
				const oldPhoto = path.join(process.env.UPLOAD_PATH, oldUser.photo)
				return fsx.unlink(oldPhoto).then(() => {
					return newUser
				}).catch(() => {
					return newUser
				})
			} else {
				return newUser
			}
		})
	},
	delete: (id) => {
		return new Promise((resolve, reject) => {
			connection.query('DELETE FROM user WHERE id=?', id, (error, result) => {
				if(!error){
					if(result.affectedRows){
						resolve({id, message:'Delete success'})
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1002',
							message: 'Cannot read requested users from database'
						})
					}
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1002',
						message: 'Cannot read requested users from database'
					})
				}
                
			})
		})
	}
}
