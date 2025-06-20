import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'
import router from '../routes'
import { OrderModel } from '../../../../checkout/repository/order.model'
import { ClientModel } from '../../../../client-adm/repository/client.model'
import TransactionModel from '../../../../payment/repository/transaction.model'
import { InvoiceModel } from '../../../../invoice/repository/invoice.model'
import InvoiceItemModel from '../../../../invoice/repository/invoice-item.model'
import ProductAdmModel from '../../../../product-adm/repository/product.model'
import StorageProductModel from '../../../../store-catalog/repository/product.model'
import { migrator } from '../../database/config-migrations/migrator'
import { Umzug } from 'umzug'

describe('E2E API - Checkout Routes', () => {
	const app: Express = express()
	app.use(express.json())
	app.use('/', router)

	let sequelize: Sequelize
	let migration: Umzug<any>

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
		})

		sequelize.addModels([
			ClientModel,
			ProductAdmModel,
			StorageProductModel,
			TransactionModel,
			InvoiceModel,
			InvoiceItemModel,
			OrderModel,
		])

		migration = migrator(sequelize)

		await migration.up()

		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it('should create an order successfully', async () => {
		await request(app).post('/clients').send({
			id: '1',
			name: 'Antonio',
			email: 'antonio.test@test.com',
			address: 'Endereço',
		})

		await request(app).post('/products').send({
			id: '1',
			name: 'Produto Exemplo',
			description: 'Descrição do produto',
			purchasePrice: 100,
			stock: 50,
		})

		await request(app).post('/products').send({
			id: '2',
			name: 'Produto Exemplo',
			description: 'Descrição do produto',
			purchasePrice: 100,
			stock: 50,
		})

		const response = await request(app)
			.post('/checkout')
			.send({
				clientId: '1',
				products: [
					{ productId: '1', quantity: 2 },
					{ productId: '2', quantity: 1 },
				],
			})

		expect(response.status).toBe(201)
		expect(response.body).toEqual({
			id: expect.any(String),
			invoiceId: null,
			status: 'pending',
			total: expect.any(Number),
			products: [
				{
					productId: '1',
				},
				{
					productId: '2',
				},
			],
		})
	})

	it('should return 400 when required fields are missing', async () => {
		const response = await request(app).post('/checkout').send({})

		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			error: 'Missing required fields',
		})
	})
})
