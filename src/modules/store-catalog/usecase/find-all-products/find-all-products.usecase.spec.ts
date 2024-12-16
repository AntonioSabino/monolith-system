import Id from '../../../@shared/domain/value-object/id.value-object'
import Product from '../../domain/product.entity'
import FindAllProductsUsecase from './find-all-products.usecase'

const product1 = new Product({
	id: new Id('1'),
	name: 'product 1',
	description: 'description 1',
	salesPrice: 100,
})

const product2 = new Product({
	id: new Id('2'),
	name: 'product 2',
	description: 'description 2',
	salesPrice: 200,
})

const MockRepository = () => {
	return {
		findAll: jest.fn().mockResolvedValue([product1, product2]),
		find: jest.fn(),
	}
}

describe('find all products usecase', () => {
	it('should return all products', async () => {
		const repository = MockRepository()
		const usecase = new FindAllProductsUsecase(repository)

		const products = await usecase.execute()

		expect(repository.findAll).toHaveBeenCalled()
		expect(products.length).toBe(2)
		expect(products[0].id).toBe('1')
		expect(products[0].name).toBe('product 1')
		expect(products[0].description).toBe('description 1')
		expect(products[0].salesPrice).toBe(100)
		expect(products[1].id).toBe('2')
		expect(products[1].name).toBe('product 2')
		expect(products[1].description).toBe('description 2')
		expect(products[1].salesPrice).toBe(200)
	})
})
