const express = require('express')
const connection = require('../config/mysql')

module.exports = {
    gets: (params) => {
        return new Promise((resolve, reject) => {
            //Filtering
            var where = []
            if(params.search) {
                where.push(`((name LIKE '${params.search}%') OR (name LIKE '%${params.search}') OR (name LIKE '%${params.search}%'))`)
            }
            var whereClause = (where.length) ? "WHERE " + where.join(" AND ") : ""
            //Sorting
            var sort = []
            sort[0] = 'updated_at'
            sort[1] = 'desc'

            if(params.sort !== undefined) {
                const columns = {name:'name', date:'updated_at', price:'price'}
                sort[0] = columns[params.sort]
            }
            if(params.order) {
                const orders = {asc:'asc', desc:'desc'}
                sort[1] = orders[params.order]
            }
            var orderClause = `ORDER BY ${sort[0]} ${sort[1]}`

            //Pagination
            var itemsPerPage = 10
            var currentPage = 1
            if(params.itemsPerPage) {
                itemsPerPage = params.itemsPerPage
            }
            if(params.page) {
                currentPage = params.page
            }
            var limit = [0,10]
            limit[0] = (currentPage - 1) * itemsPerPage
            limit[1] = itemsPerPage
            limitClause = `LIMIT ${limit[0]}, ${limit[1]}`
            //ACTION!


            connection.query(`
                SELECT SQL_CALC_FOUND_ROWS * FROM order_session ${whereClause} ${orderClause} ${limitClause}`, (error1, result1) => {
                if(!error1){
                    connection.query(`SELECT FOUND_ROWS() as found_rows`, (error2, result2) => {
                        var totalItems = result2[0].found_rows
                        var totalPages = Math.ceil(totalItems / itemsPerPage)
                        const finalResult = {
                            totalPages,
                            currentPage,
                            itemsPerPage, 
                            totalItems,
                            items: result1
                        }
                        resolve(finalResult)
                    })
                } else {
                    reject(error1)
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
