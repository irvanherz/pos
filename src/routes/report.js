const express = require('express')
const route = express.Router()
const report = require('../controller/report')
const validate = require('../middleware/report')
const {checkRole} = require('../middleware/authorization')

route.get("/reports", checkRole([0]), validate.gets, report.gets)

module.exports = route
