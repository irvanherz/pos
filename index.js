const express = require('express')
const dotenv = require('dotenv').config()
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
app.use(express.static('./uploads'))
app.use('/', cors(corsOptions), routeBase)

server = app.listen(3001, "127.0.0.1", () => {
	console.log("Listening on 127.0.0.1:3001")
})
