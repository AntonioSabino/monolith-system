import { Sequelize } from 'sequelize-typescript'
import ProductModel from '../repository/product.model'
import StoreCatalogFacadeFactory from '../factory/facade.factory'

describe('ProductRepository test', () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		})

		sequelize.addModels([ProductModel])
		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it('should find a product', async () => {
		const facade = StoreCatalogFacadeFactory.create()

		await ProductModel.create({
			id: '1',
			name: 'Product 1',
			description: 'Description 1',
			salesPrice: 100,
		})

		const result = await facade.find({ id: '1' })

		expect(result).toEqual({
			id: '1',
			name: 'Product 1',
			description: 'Description 1',
			salesPrice: 100,
		})
	})

	it('should find all products', async () => {
		const facade = StoreCatalogFacadeFactory.create()

		await ProductModel.create({
			id: '1',
			name: 'Product 1',
			description: 'Description 1',
			salesPrice: 100,
		})

		await ProductModel.create({
			id: '2',
			name: 'Product 2',
			description: 'Description 2',
			salesPrice: 200,
		})

		const result = await facade.findAll()

		expect(result.products).toEqual([
			{
				id: '1',
				name: 'Product 1',
				description: 'Description 1',
				salesPrice: 100,
			},
			{
				id: '2',
				name: 'Product 2',
				description: 'Description 2',
				salesPrice: 200,
			},
		])
	})
})
