const express = require('express')
const connection = require('../config/mysql')

module.exports = {
    gets: (orderId) => {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM order_item WHERE order_id='${orderId}' ORDER BY updated_at ASC`, (error, result) => {
                if(!error){
                    resolve(result)
                } else {
                    reject(error)
                }
            })
        })
    },
    get: (orderId, itemId) => {
        return new Promise((resolve, reject) => {
            connection.query("SELECT * FROM order_item WHERE order_id=? AND id=?", [orderId,itemId], (error, result) => {
                if(0 in result){
                    resolve(result[0])
                } else {
                    reject(new Error(`Item with ${orderId}:${itemId} not found.`))
                }
            })
        })
    },
    post: (orderId, setData) => {
        return new Promise((resolve, reject) => {
            connection.query("INSERT INTO order_item SET ?", {order_id: orderId, ...setData}, (error, result) => {
                if(!error){
                    newResult = {id:result.insertId, order_id:orderId, ...setData}
                    resolve(newResult)
                } else {
                    reject(error)
                }
            })
        })
    },
    put: (orderId, itemId, setData) => {
        return new Promise((resolve, reject) => {
            connection.query("UPDATE order_item SET ?,updated_at=CURRENT_TIMESTAMP WHERE order_id=? AND id=?", [setData, orderId, itemId], (error, result) => {
                if(!error){
                    if(result.changedRows){
                        newResult = {id:itemId, order_id:orderId, ...setData}
                        resolve(newResult)
                    } else {
                        return helper.response(response,400,new Error("Specified ID not found."))
                    }
                } else {
                    reject(error)
                }
            })
        })
    },
    delete: (orderId, itemId) => {
        return new Promise((resolve, reject) => {
            connection.query("DELETE FROM order_item WHERE order_id=? AND id=?", [orderId, itemId], (error, result) => {
                if(!error){
                    if(result.affectedRows)
                        resolve({id:itemId, message:"Delete OK"})
					else 
						reject(new Error("ID not exist"))
                } else {
                    console.log('eeeee')
                    reject(error)
                }
            })
        })
    }
}
