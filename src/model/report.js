const express = require('express')
const connection = require('../config/mysql')

module.exports = {
    gets: (options) => {
        return new Promise((resolve, reject) => {
            // const dateStart = moment().substract(1, 'month').startOf('day')
            // const dateEnd = moment().endOf('day')
            // const periodFormats = {hourly: "%Y-%m-%d %H:00:00", daily: "%Y-%m-%d %H:00:00", monthly: "%Y-%m-%d 00:00:00"}

            // const period = (dateEnd.diff(dateStart, "month") > 3) ? "monthly" : (dateEnd.diff(dateStart, "day") > 5) ? "daily" : "hourly"
            
            connection.query(`
                SELECT
                    DATE_FORMAT(updated_at, "${periodFormats[period]}") AS period, 
                    COUNT(DISTINCT order_id) AS total_orders, 
                    SUM(qty) AS item_sold, 
                    SUM(price) AS turnover 
                FROM 
                    order_item AS a
                WHERE
                    updated_at BETWEEN '' AND ''
                GROUP BY
                    time_group`, (error, result) => {
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
                    id,
                    DATE_FORMAT(updated_at, "%Y-%m-%d %H:00:00") AS time_group, 
                    COUNT(DISTINCT order_id) AS total_orders, 
                    SUM(qty) AS item_sold, 
                    SUM(price) AS turnover 
                FROM 
                    order_item AS a
                WHERE id='${$id}'
                GROUP BY
                    time_group`, (error, result) => {
                if(!error){
                    resolve(result)
                } else {
                    reject(error)
                }
            })
        })
    }
}
