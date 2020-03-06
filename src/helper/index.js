
module.exports = {
	response: (response, status, data) => {
		const result = {}
		result.status = status || 200
		if(status >= 400){
			if(data instanceof Error){
				result.errors = [{code: 'GeneralError', errno: 9999, message: data.message}]
			} else if (data instanceof Array) {
				result.errors = data
			} else {
				result.errors = [data]
			}
		} else result.data = data
		
		return response.status(result.status).json(result)
	}
}
