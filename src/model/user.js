const connection = require('../config/mysql')
const crypto = require('crypto')

module.exports = {
    post: (setData) => {
        return new Promise((resolve, reject) => {
            setData.password = crypto.createHash('sha256').update(setData.password).digest('hex')
            connection.query("INSERT INTO user SET ?", setData, (error, result) => {
                if(!error){
                    newResult = {id:result.insertId, ...setData}
                    delete newResult.password
                    resolve(newResult)
                } else {
                    if(error.code == 'ER_DUP_ENTRY')
                        reject(new Error('Username already exist'))
                    else
                        reject(error)
                }
            })
        })
    },
    get: (username, password) => {
        return new Promise((resolve, reject) => {
            password = crypto.createHash('sha256').update(password).digest('hex')
            connection.query(`SELECT * FROM user WHERE username=? AND password=? `, 
                [username, password], (error, result) => {
					if (!error) {
                        if(0 in result) {
                            delete result[0].password
                            resolve(result[0]);
                        } else {
                            reject(new Error("Invalid username or password"))
                        }
					} else {
						reject(new Error(error));
					}
				}
			);
		});
    }
}
