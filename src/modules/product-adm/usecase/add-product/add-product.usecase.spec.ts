import AddProductUsecase from './add-product.usecase'

describe('AddProductUsecase unit test', () => {
	const MockRepository = () => {
		return {
			add: jest.fn(),
			find: jest.fn(),
		}
	}

	it('should add a product', async () => {
		const repository = MockRepository()
		const usecase = new AddProductUsecase(repository)
		const input = {
			name: 'product name',
			description: 'product description',
			purchasePrice: 10,
			stock: 10,
		}

		const result = await usecase.execute(input)

		expect(repository.add).toHaveBeenCalledTimes(1)
		expect(result.id).toBeDefined()
		expect(result.name).toBe(input.name)
		expect(result.description).toBe(input.description)
		expect(result.purchasePrice).toBe(input.purchasePrice)
		expect(result.stock).toBe(input.stock)
		expect(result.createdAt).toBeDefined()
		expect(result.updatedAt).toBeDefined()
	})
})
