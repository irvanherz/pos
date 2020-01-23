const express = require('express')
const connection = require('../config/mysql')

module.exports = {
    gets: (getOptions) => {
        return new Promise((resolve, reject) => {
            var whereClause = ""
            var limitClause = "LIMIT 10"
            var offsetClause = "OFFSET 0"
            var orderClause = "ORDER BY updated_at DESC"
            
            var whereConditions = []
            if(getOptions.q !== undefined) {
				getOptions.q = connection.escape(getOptions.q)
				whereConditions.push(`name LIKE "%${getOptions.q}%"`)
            }
            if(getOptions.date !== undefined) {
                if(/^[0-9]{8}-[0-9]{8}$/.test(getOptions.date) == true){
                    var y0 = getOptions.date.substring(0, 4);
                    var m0 = getOptions.date.substring(4, 6);
                    var d0 = getOptions.date.substring(6, 8);
                    var y1 = getOptions.date.substring(9, 13);
                    var m1 = getOptions.date.substring(13, 15);
                    var d1 = getOptions.date.substring(15, 17);
                    whereConditions.push(`(a.updated_at BETWEEN '${y0}-${m0}-${d0} 00:00:00' AND '${y1}-${m1}-${d1} 23:59:59')`)
                } else if(/^[0-9]{8}$/.test(getOptions.date) == true) {
                    var y0 = getOptions.date.substring(0, 4);
                    var m0 = getOptions.date.substring(4, 6);
                    var d0 = getOptions.date.substring(6, 8);
                    whereConditions.push(`(a.updated_at BETWEEN '${y0}-${m0}-${d0} 00:00:00' AND '${y0}-${m0}-${d0} 23:59:59')`)
                }
            }
            if(whereConditions.length) whereClause = "WHERE " + whereConditions.join(" AND ")
			//sorting
			var sortColumn = 'updated_at'
			var sortOrder = 'desc'
			if(getOptions.sort !== undefined) {
				columns = {name:'name', category:'category', date:'updated_at'}
				sortColumn = columns[getOptions.sort]
			}
			if(getOptions.order !== undefined) {
				orders = {asc:'asc', desc:'desc'}
				sortOrder = orders[getOptions.order]
			}
			var orderClause = `ORDER BY ${sortColumn} ${sortOrder}`
            //page
			if(getOptions.page !== undefined) {
                var limit = (getOptions.limit !== undefined) ? getOptions.limit : 10
                var offset = (getOptions.page-1) * limit
                offsetClause = `OFFSET ${offset}`
            }
            //limit
			if(getOptions.limit !== undefined) {
				limitClause = `LIMIT ${getOptions.limit}`
			}
            //run query
            
            connection.query(`
                            SELECT 
                                a.id,a.name,a.description,b.name AS category,a.image,a.price,a.created_at,a.updated_at
                            FROM
                                product AS a
							LEFT JOIN
							    category AS b
							ON a.category_id=b.id
							${whereClause}
							${orderClause}
							${limitClause}
							${offsetClause}`, (error, result) => {
                if(!error){
                    resolve(result)
                } else {
                    reject(error)
                }
            })
        })
    },
    get: (id) => {
        return new Promise((resolve, reject) => {
            connection.query(`
                    SELECT 
                        a.id,a.name,a.description,b.name AS category,a.image,a.price,a.created_at,a.updated_at
                    FROM
                        product AS a
                    LEFT JOIN
                        category AS b
                    ON a.category_id=b.id WHERE a.id=${id}`, (error, result) => {
                if(!error){
                    if(0 in result){
                        resolve(result[0])
                    } else {
                        reject(new Error(`Product with id:${id} not found.`))
                    }
                } else {
                    reject(error)
                }
            })
        })
    },
    post: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO product SET ?", setData, (error, result) => {
                if(!error){
                    newResult = {id:result.insertId, ...setData}
                    resolve(newResult)
                } else {
                    reject(error)
                }
            })
        })
    },
    put: async (id, setData) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT image FROM product WHERE id=?", id, (error, result) => {
                var oldImage = (result[0]) ? result[0].image : null
                connection.query("UPDATE product SET ?,updated_at=CURRENT_TIMESTAMP WHERE id=?", [setData,id], (error, result) => {
                    if(!error){
                        if(result.changedRows){
                            if(oldImage && setData.image){
                                require('fs').unlink(`uploads/${oldImage}`, (err) => {
                                    newResult = {id:result.insertId, ...setData}
                                    resolve(newResult)
                                })
                            } else {
                                newResult = {id:result.insertId, ...setData}
                                resolve(newResult)
                            }
                        } else {
                            reject(new Error("Specified ID not found."))
                        }
                    } else {
                        reject(error)
                    }
                })
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM product WHERE id=?", id, (error, result) => {
                if(!error){
                    if(result.affectedRows)
                        resolve({id, message:"Delete OK"})
					else 
						reject(new Error("ID not exist"))
                } else {
                    reject(error)
                }
            })
        })
    }
}
