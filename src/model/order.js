const express = require('express')
const connection = require('../config/mysql')

module.exports = {
    gets: (getOptions) => {
        return new Promise((resolve, reject) => {
            var whereClause = ""
            var limitClause = "LIMIT 10"
            var offsetClause = "OFFSET 0"
            var orderClause = "ORDER BY updated_at DESC"
            
			if(getOptions.status !== undefined) {
				whereClause = `WHERE status=${getOptions.status}`
			}
			if(getOptions.sort !== undefined) {
				columns = {name:'name',date:'updated_at'}
				sortColumn = columns[getOptions.sort]
			}
			if(getOptions.order !== undefined) {
				orders = {asc:'asc', desc:'desc'}
				sortOrder = orders[getOptions.order]
			}
			if(getOptions.limit !== undefined) {
				limitClause = `LIMIT ${getOptions.limit}`
			}
			if(getOptions.offset !== undefined) {
				offsetClause = `OFFSET ${getOptions.offset}`
			}
			connection.query(`SELECT * FROM order_session ${whereClause} ${orderClause} ${limitClause} ${offsetClause}`, (error, result) => {
                if(!error){
                    resolve(result)
                } else {
                    console.log(error)
                    reject(error)
                }
            })
        })
    },
    get: (id) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM order_session WHERE id=?", id, (error, result) => {
                if(!error){
                    if(0 in result){
                        resolve(result[0])
                    } else {
                        reject(new Error(`Order with id:${id} not found.`))
                    }
                } else {
                    reject(error)
                }
            })
        })
    },
    post: (setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO order_session SET ?", setData, (error, result) => {
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
            connection.query("UPDATE order_session SET ?,updated_at=CURRENT_TIMESTAMP WHERE id=?", [setData,id], (error, result) => {
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
            connection.query("DELETE FROM order_item WHERE order_id=?", id, (error, result) => {
                if(!error){
                    if(result.affectedRows){
                        connection.query("DELETE FROM order_session WHERE invoice_id=?", id, (error, result) => {
                            if(!error){
                                if(result.affectedRows){
                                    resolve({id,message:"Delete OK"})
                                } else {
                                    reject(new Error("Items with specified ID not found"))
                                }
                            } else {
                                reject(error)
                            }
                        })
                    } else {
                        reject(new Error("Items with specified ID not found"))
                    }
                } else {
                    reject(error)
                }
            })
        })
    }
}
