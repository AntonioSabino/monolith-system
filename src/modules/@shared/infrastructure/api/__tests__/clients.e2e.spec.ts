import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'
import router from '../routes'
import { ClientModel } from '../../../../client-adm/repository/client.model'

describe('E2E API - Clients Routes', () => {
	const app: Express = express()
	app.use(express.json())
	app.use('/', router)

	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
		})

		sequelize.addModels([ClientModel])

		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it('should add a client successfully', async () => {
		const response = await request(app).post('/clients').send({
			id: '1',
			name: 'Antonio',
			email: 'antonio.test@test.com',
			address: 'Endereço',
		})

		expect(response.status).toBe(201)
		expect(response.body).toEqual({
			message: 'Client created successfully',
		})
	})

	it('should return 400 when required fields are missing', async () => {
		const response = await request(app).post('/clients').send({})

		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			error: 'Missing required fields',
		})
	})
})
