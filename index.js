const express = require('express')
const dotenv = require('dotenv').config()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const routeBase = require('./src/routes/index')
const cors = require('cors')
const helper = require('./src/helper/')
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger.json')

var corsOptions = {
	origin: 'http://localhost:3000'
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use('/assets',express.static('./uploads'))
app.use('/', cors(corsOptions), routeBase)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

const server = app.listen(3001, '127.0.0.1', () => {
	console.log('Listening on 127.0.0.1:3001')
})

module.exports = server