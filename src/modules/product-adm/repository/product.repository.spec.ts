import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from './product.model'
import Product from '../domain/product.entity'
import Id from '../../@shared/domain/value-object/id.value-object'
import ProductRepository from './product.repository'

describe('ProductRepository Test', () => {
	let sequelize: Sequelize

	beforeAll(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		})

		sequelize.addModels([ProductModel])
		await sequelize.sync()
	})

	afterAll(async () => {
		await sequelize.close()
	})

	it('should create a product', async () => {
		const productProps = {
			id: new Id('1'),
			name: 'product',
			description: 'description',
			purchasePrice: 10,
			stock: 10,
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		const product = new Product(productProps)
		const productRepository = new ProductRepository()
		await productRepository.add(product)

		const productModel = await ProductModel.findByPk('1')

		expect(productModel).not.toBeNull()
		expect(productModel.id).toBe(product.id.value)
		expect(productModel.name).toBe(product.name)
		expect(productModel.description).toBe(product.description)
		expect(productModel.purchasePrice).toBe(product.purchasePrice)
		expect(productModel.stock).toBe(product.stock)
	})

	it('should find a product', async () => {
		const productModel = await ProductModel.create({
			id: '2',
			name: 'product',
			description: 'description',
			purchasePrice: 10,
			stock: 10,
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		const productRepository = new ProductRepository()
		const product = await productRepository.find('2')

		expect(product).not.toBeNull()
		expect(product.id.value).toBe(productModel.id)
		expect(product.name).toBe(productModel.name)
		expect(product.description).toBe(productModel.description)
		expect(product.purchasePrice).toBe(productModel.purchasePrice)
		expect(product.stock).toBe(productModel.stock)
	})
})
