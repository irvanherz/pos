const express = require('express')
const route = express.Router()
const product = require('../controller/product.js')
const verify = require('../middleware/product.js')
const os = require('os')
const path = require('path')
const helper = require('../helper')
const {checkRole} = require('../middleware/authorization')
const process = require('process')

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
		if(process.env.UPLOAD_FILTEREXT){
			filters = process.env.UPLOAD_FILTEREXT.toLowerCase().split('|')
		}
		if(filters.includes(path.extname(file.originalname).toLowerCase()) == false){
			return cb(new Error('File not supported'), false)
		}
		cb(null, true)
	},
	limits: {fileSize: process.env.UPLOAD_SIZELIMIT}
}

const upload = multer(multerOptions).single('image')

const uploadFilter = (request, response, next) => {
	upload(request, response, (error) => {
		if (error instanceof multer.MulterError) {
			return helper.response(response,400,error)
		} else if (error) {
			return helper.response(response,400,error)
		}
		next()
	})
}

route.get('/', verify.gets, product.gets)
route.get('/:id([0-9]+)', verify.get, product.get)
route.post('/', checkRole([0]), uploadFilter, verify.post, product.post)
route.put('/:id([0-9]+)', checkRole([0]), uploadFilter, verify.put, product.put)
route.delete('/:id([0-9]+)', checkRole([0]), verify.delete, product.delete)

module.exports = route
