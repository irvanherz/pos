const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const routeBase = require('./src/routes/index')
const cors = require('cors')
const helper = require('./src/helper/')

var corsOptions = {
	origin: 'http://localhost'
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use('/', cors(corsOptions), routeBase)
// app.use(function (err, req, res, next) {
// 	console.error(err.stack)
// 	helper.response(res,500,"Unhandled server error!")
// })

server = app.listen(3001, "127.0.0.1", () => {
	console.log("Listening on 127.0.0.1:3001")
})
