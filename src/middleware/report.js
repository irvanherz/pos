const path = require('path')
const fs = require('fs')
const helper = require('../helper/')


module.exports = {
	gets: (request, response, next) => {
        var errors = []
        
        if(request.params.date){
            if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.params.date) == false){
                return helper.response(response,400,new Error('Invalid date'))
            }
        }

        if(request.params.dateStart){
            if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.params.dateStart) == false){
                return helper.response(response,400,new Error('Invalid date'))
            }
        }

        if(request.params.dateEnd){
            if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.params.dateEnd) == false){
                return helper.response(response,400,new Error('Invalid date'))
            }
        }
        
        if(request.params.date || request.params.dateStart){
            return helper.response(response,400,new Error('Parameter date should not coexist with dateStart'))
        }

		if(errors.length){
			return helper.response(response,400,errors)
		}
		next()
	},
	get: (request, response, next) => {
		var errors = []
        
        if(request.params.date){
            if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.params.date) == false){
                return helper.response(response,400,new Error('Invalid date'))
            }
        }

        if(request.params.dateStart){
            if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.params.dateStart) == false){
                return helper.response(response,400,new Error('Invalid date'))
            }
        }

        if(request.params.dateEnd){
            if(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(request.params.dateEnd) == false){
                return helper.response(response,400,new Error('Invalid date'))
            }
        }
        
        if(request.params.date || request.params.dateStart){
            return helper.response(response,400,new Error('Parameter date should not coexist with dateStart'))
        }
        
		if(errors.length){
			return helper.response(response,400,errors)
		}
		next()
	}
}
