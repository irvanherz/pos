const express = require('express')
const route = express.Router()
const user = require('../controller/user')
const validate = require('../middleware/user')
const os = require('os')
const path = require('path')
const helper = require('../helper')
const { checkRole } = require('../middleware/authorization')

const multer = require('multer')
const multerOptions = {
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, os.tmpdir())
		},
		filename: function (req, file, cb) {
			cb(null, Date.now() + path.extname(file.originalname))
		}
	}),
	fileFilter: (req, file, cb) => {
		var filters = []
		if (process.env.UPLOAD_FILTEREXT) {
			filters = process.env.UPLOAD_FILTEREXT.toLowerCase().split('|')
		}
		if (filters.includes(path.extname(file.originalname).toLowerCase()) == false) {
			return cb(new Error('File not supported'), false)
		}
		cb(null, true)
	},
	limits: { fileSize: process.env.UPLOAD_SIZELIMIT }
}

const upload = multer(multerOptions).single('photo')

const uploadFilter = (request, response, next) => {
	upload(request, response, (error) => {
		if (error instanceof multer.MulterError) {
			return helper.response(response, 400, error)
		} else if (error) {
			return helper.response(response, 400, error)
		}
		next()
	})
}

route.get('/', validate.gets, user.gets)
route.get('/:id', validate.get, user.get)
route.post('/', uploadFilter, validate.post, user.post)
route.put('/:id', uploadFilter, validate.put, user.put)
route.delete('/:id', validate.delete, user.delete)

module.exports = route
