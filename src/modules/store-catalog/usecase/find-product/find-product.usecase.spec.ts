import Id from '../../../@shared/domain/value-object/id.value-object'
import Product from '../../domain/product.entity'
import FindProductUseCase from './find-product.usecase'

const product = new Product({
	id: new Id('1'),
	name: 'Product 1',
	description: 'Description 1',
	salesPrice: 10,
})

const MockRepository = () => {
	return {
		findAll: jest.fn(),
		find: jest.fn().mockResolvedValue(product),
	}
}

describe('find a product usecase unit test', () => {
	it('should find a product', async () => {
		const repository = MockRepository()
		const findProduct = new FindProductUseCase(repository)
		const input = { id: '1' }
		const output = await findProduct.execute(input)

		expect(repository.find).toHaveBeenCalled()
		expect(output).toEqual({
			id: '1',
			name: 'Product 1',
			description: 'Description 1',
			salesPrice: 10,
		})
	})
})
