import { Sequelize } from 'sequelize-typescript'
import express, { Express } from 'express'
import request from 'supertest'
import { migrator } from './config-migrations/migrator'
import ProductAdmModel from '../../../product-adm/repository/product.model'
import ProductStorageModel from '../../../store-catalog/repository/product.model'
import productsRouter from '../api/routes/products.routes'
import { Umzug } from 'umzug'

describe('Product Migrations Test', () => {
	const app: Express = express()
	app.use(express.json())
	app.use('/products', productsRouter)

	let sequelize: Sequelize

	let umzug: Umzug<any>

	beforeAll(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
		})

		sequelize.addModels([ProductAdmModel, ProductStorageModel])
		umzug = migrator(sequelize)

		await umzug.up()
		await sequelize.sync()
	})

	afterEach(async () => {
		if (!umzug || !sequelize) {
			return
		}
		umzug = migrator(sequelize)
		await umzug.down()
		await sequelize.close()
	})

	it('should create a product', async () => {
		const response = await request(app).post('/products').send({
			id: '1',
			name: 'Product 1',
			description: 'Description 1',
			purchasePrice: 100,
			stock: 50,
		})

		expect(response.status).toBe(201)
		expect(response.body.message).toBe('Product created successfully')

		const product = await ProductAdmModel.findByPk('1')
		expect(product).not.toBeNull()
		expect(product.id).toBe('1')
		expect(product.name).toBe('Product 1')
		expect(product.description).toBe('Description 1')

		expect(product.purchasePrice).toBe(100)
		expect(product.stock).toBe(50)
	})
})
