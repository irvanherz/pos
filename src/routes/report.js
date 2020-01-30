const express = require('express')
const route = express.Router()
const report = require('../controller/report')
const validate = require('../middleware/report')

route.get("/report", validate.gets, report.gets)
route.get("/report/:id", validate.get, report.get)

module.exports = route
