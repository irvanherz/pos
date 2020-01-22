
module.exports = {
	authorization: (request, response, next) => {
		res.header("Access-Control-Allow-Origin", "localhost")
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
		next();
	}
}
