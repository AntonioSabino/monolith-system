import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'
import router from '../routes'
import { InvoiceModel } from '../../../../invoice/repository/invoice.model'
import InvoiceItemModel from '../../../../invoice/repository/invoice-item.model'

describe('E2E API - Invoice Routes', () => {
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

		sequelize.addModels([InvoiceModel, InvoiceItemModel])

		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it('should generate an invoice successfully', async () => {
		const response = await request(app)
			.post('/invoice')
			.send({
				name: 'Test Invoice',
				document: '12345678900',
				street: 'Test Street',
				number: '100',
				city: 'Test City',
				state: 'TS',
				zipCode: '12345-678',
				items: [
					{ id: '1', name: 'Item 1', price: 100, quantity: 2 },
					{ id: '2', name: 'Item 2', price: 50, quantity: 1 },
				],
			})

		expect(response.status).toBe(201)
		expect(response.body).toEqual({
			id: expect.any(String),
			name: 'Test Invoice',
			document: '12345678900',
			street: 'Test Street',
			number: '100',
			city: 'Test City',
			state: 'TS',
			zipCode: '12345-678',
			items: [
				{ id: expect.any(String), name: 'Item 1', price: 100 },
				{ id: expect.any(String), name: 'Item 2', price: 50 },
			],
			total: 150,
		})
	})

	it('should return 400 when required fields are missing', async () => {
		const response = await request(app).post('/invoice').send({})

		expect(response.status).toBe(400)
		expect(response.body).toEqual({ error: 'Missing required fields' })
	})
})
