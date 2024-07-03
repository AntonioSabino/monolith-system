import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../repository/product.model'
import ProductAdmFacadeFactory from '../factory/facade.factory'

describe('ProductAdmFacade', () => {
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
		const productAdmFacade = ProductAdmFacadeFactory.create()

		const input = {
			id: '1',
			name: 'Product 1',
			description: 'Product 1 description',
			purchasePrice: 10,
			stock: 10,
		}

		await productAdmFacade.addProduct(input)

		const product = await ProductModel.findByPk('1')

		expect(product).toBeDefined()
		expect(product.id).toBe('1')
		expect(product.name).toBe('Product 1')
		expect(product.description).toBe('Product 1 description')
		expect(product.purchasePrice).toBe(10)
		expect(product.stock).toBe(10)
	})

	it('should check stock', async () => {
		const productAdmFacade = ProductAdmFacadeFactory.create()

		const input = {
			id: '2',
			name: 'Product 2',
			description: 'Product 2 description',
			purchasePrice: 20,
			stock: 20,
		}

		await productAdmFacade.addProduct(input)

		const output = await productAdmFacade.checkStock({ productId: '2' })

		expect(output).toEqual({
			productId: '2',
			stock: 20,
		})
	})
})
