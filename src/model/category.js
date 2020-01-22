const express = require('express')
const connection = require('../config/mysql')

module.exports = {
    gets: (getOptions) => {
        return new Promise((resolve, reject) => {
            var whereClause = ""
            var limitClause = "LIMIT 100"
            var offsetClause = "OFFSET 0"
            var orderClause = "ORDER BY updated_at DESC"
            
			//sorting
			var sortColumn = 'updated_at'
			var sortOrder = 'desc'
			if(getOptions.sort !== undefined) {
				columns = {name:'name',date:'updated_at'}
				sortColumn = columns[getOptions.sort]
			}
			if(getOptions.order !== undefined) {
				orders = {asc:'asc', desc:'desc'}
				sortOrder = orders[getOptions.order]
			}
			var orderClause = `ORDER BY ${sortColumn} ${sortOrder}`
			//limit
			if(getOptions.limit !== undefined) {
				limitClause = `LIMIT ${getOptions.limit}`
			}
			//offset
			if(getOptions.offset !== undefined) {
				offsetClause = `OFFSET ${getOptions.offset}`
			}
            //run query
			connection.query(`
                            SELECT * FROM category
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
            connection.query("SELECT * FROM category WHERE id=?", id, (error, result) => {
                if(!error){
                    if(0 in result){
                        resolve(result[0])
                    } else {
                        reject(new Error(`Category with id:${id} not found.`))
                    }
                } else {
                    reject(error)
                }
            })
        })
    },
    post: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO category SET ?", setData, (error, result) => {
                if(!error){
                    newResult = {id:result.insertId, ...setData}
                    resolve(newResult)
                } else {
                    reject(error)
                }
            })
        })
    },
    put: (id, setData) => {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE category SET ?,updated_at=CURRENT_TIMESTAMP WHERE id=?", [setData,id], (error, result) => {
                if(!error){
                    if(result.changedRows){
                        newResult = {id, ...setData}
                        resolve(newResult)
                    } else {
                        reject(new Error(`Order with id:${id} not found.`))
                    }
                } else {
                    reject(error)
                }
            })
        })
    },
    delete: (id) => {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM category WHERE id=?", id, (error, result) => {
                if(!error){
                    if(result.affectedRows){
                        resolve({id, message:"Delete OK"})
                    } else {
                        reject(new Error(`Category with id:${id} not found.`))
                    }
                } else {
                    reject(error)
                }
                
            })
        })
    }
}
