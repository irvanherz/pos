const express = require('express')
const route = express.Router()
const product = require('../controller/product.js')
const verify = require('../middleware/product.js')


const multer = require('multer')
const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
		  cb(null, 'uploads/')
		},
		filename: function (req, file, cb) {
		  cb(null, Date.now() + require('path').extname(file.originalname))
		}
	}),
	fileFilter: (req, file, cb) => {
		cb(null, true)
	},
	limits: {fieldSize: 2*2**20}
})


route.get("/", verify.gets, product.gets)
route.get("/:id", verify.get, product.get)
route.post("/", upload.single('image'), verify.post, product.post)
route.put("/:id", upload.single('image'), verify.put, product.put)
route.delete("/:id", verify.delete, product.delete)

module.exports = route
