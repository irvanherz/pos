const helper = require('../helper/')


module.exports = {
	gets: (request, response, next) => {
		var errors = []

		//End
		if(request.query.dateStart){
			if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.query.dateStart) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: 'Invalid dateStart',
					field: 'query.dateStart'
				})
			}
		} 
		if(request.query.dateEnd){
			if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.query.dateEnd) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message:'Invalid dateEnd format',
					field: 'query.dateEnd'
				})
			}
		} 
        
		if(request.query.period) {
			if(['hourly', 'daily', 'monthly', 'yearly'].includes(request.query.period) == false){
				errors.push({
					code: 'ValidationError',
					errno: '1000',
					message: `Period '${request.query.period}' is not supported.`,
					field: 'quer.period'
				})
			}
		} else {
			request.query.period = 'daily'
		}
        
		if(errors.length){
			return helper.response(response,400,errors)
		}
		next()
	},
}
