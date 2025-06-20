import express, { Express } from 'express'
import { Sequelize } from 'sequelize-typescript'
import request from 'supertest'
import router from '../routes'
import { Umzug } from 'umzug'
import { migrator } from '../../database/config-migrations/migrator'
import ProductAdmModel from '../../../../product-adm/repository/product.model'
import StorageProductModel from '../../../../store-catalog/repository/product.model'

describe('E2E API - Products Routes', () => {
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

		sequelize.addModels([ProductAdmModel, StorageProductModel])

		migration = migrator(sequelize)

		await migration.up()

		await sequelize.sync()
	})

	afterEach(async () => {
		if (!migration || !sequelize) {
			return
		}
		migration = migrator(sequelize)
		await migration.down()
		await sequelize.close()
	})

	it('should add a product successfully', async () => {
		const response = await request(app).post('/products').send({
			id: '1',
			name: 'Produto Exemplo',
			description: 'Descrição do produto',
			purchasePrice: 100,
			stock: 50,
		})

		expect(response.status).toBe(201)
		expect(response.body).toEqual({
			message: 'Product created successfully',
		})
	})

	it('should return 400 when required fields are missing', async () => {
		const response = await request(app).post('/products').send({})

		expect(response.status).toBe(400)
		expect(response.body).toEqual({
			error: 'Missing required fields',
		})
	})
})
