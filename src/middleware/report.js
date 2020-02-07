const path = require('path')
const fs = require('fs')
const helper = require('../helper/')


module.exports = {
	gets: (request, response, next) => {
        var errors = []

        //End
        if(request.params.dateStart){
            if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.params.dateStart) == false){
                errors.push(new Error('Invalid dateStart format'))
            }
        } 
        if(request.params.dateEnd){
            if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.params.dateEnd) == false){
                errors.push(new Error('Invalid dateEnd format'))
            }
        } 
        
        if(request.query.period) {
			if(['hourly', 'daily', 'monthly', 'yearly'].includes(request.query.period) == false){
				errors.push(new Error(`Period '${request.query.period}' is not supported.`))
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
