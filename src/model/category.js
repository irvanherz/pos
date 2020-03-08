const connection = require('../config/mysql')


module.exports = {
	gets: (params) => {
		//Filtering
		var where = []
		if (params.search) {
			where.push(`((name LIKE '${params.search}%') OR (name LIKE '%${params.search}') OR (name LIKE '%${params.search}%'))`)
		}
		var whereClause = (where.length) ? 'WHERE ' + where.join(' AND ') : ''
		//Sorting
		var sort = []
		sort[0] = 'updated_at'
		sort[1] = 'desc'

		if (params.sort !== undefined) {
			const columns = { name: 'name', date: 'updated_at' }
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
                SELECT * FROM category
                ${whereClause}
                ${orderClause}
                ${limitClause}`, (error, result) => {
				if(!error){
					resolve(result)
				} else {
					reject({
						code: 'DatabaseError',
						errno: '1100',
						message: 'Cannot read requested data of categories from database'
					})
				}
			})
		}).then(categories => {
			return new Promise ((resolve, reject) => {
				connection.query(`SELECT COUNT(*) as found_rows FROM category ${ whereClause }`, (error, result) => {
					if(!error){
						var totalItems = result[0].found_rows
						var totalPages = Math.ceil(totalItems / itemsPerPage)
						resolve({
							totalPages,
							currentPage,
							itemsPerPage,
							totalItems,
							items: categories
						})
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1101',
							message: 'Cannot read requested data of categories from database'
						})
					}
					
				})
			})
		})
	},
	get: (id) => {
		return new Promise((resolve, reject) => {
			connection.query('SELECT * FROM category WHERE id=?', id, (error, result) => {
				if(!error){
					if(result.length > 0){
						resolve(result[0])
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1102',
							message: `Cannot read category data ID ${id} from database`
						})
					}
				} else {
					reject(error)
					reject({
						code: 'DatabaseError',
						errno: '1103',
						message: 'Cannot read requested category data from database'
					})
				}
			})
		})
	},
	post: (setData) => {
		return new Promise((resolve, reject) => {
			connection.query('INSERT INTO category SET ?', setData, (error, result) => {
				if(!error){
					const newResult = {id:result.insertId, ...setData}
					resolve(newResult)
				} else {
					reject(error)
					reject({
						code: 'DatabaseError',
						errno: '1104',
						message: 'Cannot write category to database'
					})
				}
			})
		})
	},
	put: (id, setData) => {
		return new Promise((resolve, reject) => {
			connection.query('UPDATE category SET ? WHERE id=?', [setData,id], (error, result) => {
				if(!error){
					if(result.affectedRows){
						const newResult = {id, ...setData}
						resolve(newResult)
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1105',
							message: `Category data with id ${id} not exists`
						})
					}
				} else {
					reject(error)
					reject({
						code: 'DatabaseError',
						errno: '1106',
						message: 'Cannot edit category data'
					})
				}
			})
		})
	},
	delete: (id) => {
		return new Promise((resolve, reject) => {
			connection.query('DELETE FROM category WHERE id=?', id, (error, result) => {
				if(!error){
					if(result.affectedRows){
						resolve({id, message:'Delete success'})
					} else {
						reject({
							code: 'DatabaseError',
							errno: '1107',
							message: `Category data ${id} does not exists`
						})
					}
				} else {
					reject(error)
					reject({
						code: 'DatabaseError',
						errno: '1108',
						message: 'Cannot delete category data from database'
					})
				}
                
			})
		})
	}
}
