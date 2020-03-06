const express = require('express')
const connection = require('../config/mysql')
const moment = require('moment')

module.exports = {
	gets: (params) => {
		return new Promise((resolve, reject) => {
			const periodSets0 = {hourly: '%Y-%m-%d %H:00:00', daily: '%Y-%m-%d 00:00:00', monthly: '%Y-%m-01 00:00:00', yearly: '%Y-01-01 00:00:00'}
			const periodSets1 = {hourly: 'hour', daily: 'day', monthly: 'month', yearly: 'year'}
			const periodSets2 = {hourly: 'hours', daily: 'days', monthly: 'months', yearly: 'years'}

			const timeStart = moment(params.dateStart, 'YYYY-MM-DD').startOf(periodSets1[params.period])
			const timeEnd = moment(params.dateEnd, 'YYYY-MM-DD').endOf(periodSets1[params.period])
			connection.query(`
                SELECT
                    DATE_FORMAT(updated_at, "${periodSets0[params.period]}") AS period, 
                    COUNT(DISTINCT order_id) AS total_orders, 
                    SUM(qty) AS item_sold, 
                    SUM(price) AS turnover 
                FROM 
                    order_item AS a
                WHERE
                    updated_at BETWEEN '${timeStart.format('YYYY-MM-DD HH:mm:ss')}' AND '${timeEnd.format('YYYY-MM-DD HH:mm:ss')}'
                GROUP BY
                    period
                ORDER BY period ASC`, (error, result) => {
				if(!error){
					let report = []
					let timePointer = moment(timeStart)

					do {
						let theData = {
							total_orders: 0,
							item_sold: 0,
							turnover: 0
						}
						if(result[0] && result[0].period == timePointer.format('YYYY-MM-DD HH:mm:ss') ) {
							theData = result.shift()
							delete theData.period
						}
						report.push({
							timeStart: timePointer.format('YYYY-MM-DD HH:mm:ss'),
							timeEnd: moment(timePointer).endOf(periodSets1[params.period]).format('YYYY-MM-DD HH:mm:ss'),
							...theData
						})
						timePointer = timePointer.add(1, periodSets2[params.period])
					} while(timePointer.isBefore(timeEnd))

					let finalResult = {
						start: timeStart.format('YYYY-MM-DD HH:mm:ss'),
						end: timeEnd.format('YYYY-MM-DD HH:mm:ss'),
						data: report
					}
					resolve(finalResult)
				} else {
					reject(error)
				}
			})
		})
	},
}
