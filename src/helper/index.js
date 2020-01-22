
module.exports = {
	response: (response, status, data) => {
		const result = {}
		result.status = status || 200
		if(status >= 400){
			if(data instanceof Error){
				result.errors = [{name: data.name, message: data.message}]
			} else if (data instanceof Array) {
				result.errors = []
				data.forEach((val) => {
					if(val instanceof Error){
						result.errors.push({name: val.name, message: val.message})
					}
				})
			}
		} else result.data = data
		
		return response.status(result.status).json(result)
	}
}
