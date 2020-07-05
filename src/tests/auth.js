const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../index')

let signupCred = {
	'name': 'Test name',
	'username': 'test_username',
	'password_1': 'test_password',
	'password_2': 'test_password',
	'role': '1'
}
let signinCred = {
	'username': 'test_username',
	'password': 'test_password'
}
let userId = null
let authToken = null
//let authToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjksInVzZXJuYW1lIjoiYWRtaW4iLCJuYW1lIjoiQWRtaW4iLCJwaG90byI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMS9hc3NldHMvMTU4MzY4NjA1NTk4MS5wbmciLCJnZW5kZXIiOm51bGwsInJvbGUiOjAsInN0YXR1cyI6MCwiY3JlYXRlZF9hdCI6IjIwMjAtMDItMTNUMDQ6MDI6NDEuMDAwWiIsInVwZGF0ZWRfYXQiOiIyMDIwLTAzLTA4VDIzOjA5OjE0LjAwMFoiLCJpYXQiOjE1ODQ2NzA3NjgsImV4cCI6MTU4NTI3NTU2OH0.xKWJjIWy9snsjM2Wf7qeLzr08TpCrcSXM3Xp-Qutxwc'
// Configure chai
chai.use(chaiHttp)
chai.should()
describe('Auth', () => {
	describe('POST /auth/signup', () => {
		it('should signup correctly', (done) => {
			chai.request(app)
				.post('/auth/signup')
				//.set('Authorization', authToken)
			//.set('Content-Type', 'application/x-www-form-urlencoded')
				.type('form')
				.send(signupCred)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('data')
					res.body.data.should.have.property('id')
					userId = res.body.data.id
					done()
				})
		})
	})
	describe('POST /auth/signin', () => {
		it('should signin correctly', (done) => {
			chai.request(app)
				.post('/auth/signin')
				.type('form')
				.send(signinCred)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					res.body.should.have.property('data')
					res.body.data.should.have.property('id')
					authToken = res.body.data.token
					done()
				})
		})
	})
	describe('DELETE /users/:userId', () => {
		it('should delete user correctly', (done) => {
			chai.request(app)
				.delete(`/users/${userId}`)
				.set('Authorization', authToken)
				.end((err, res) => {
					res.should.have.status(200)
					res.body.should.be.a('object')
					done()
				})
		})
	})
})