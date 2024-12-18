import e from 'express'
import AddClientUseCase from './add-client.usecase'

const MockRepository = () => {
	return {
		add: jest.fn(),
		find: jest.fn(),
	}
}

describe('AddClientUsecase', () => {
	it('should add a client', async () => {
		const repository = MockRepository()
		const usecase = new AddClientUseCase(repository)

		const input = {
			name: 'any_name',
			email: 'any@mail.com',
			address: 'any_address',
		}

		const result = await usecase.execute(input)

		expect(repository.add).toHaveBeenCalled()
		expect(result.id).toBeDefined()
		expect(result.name).toBe(input.name)
		expect(result.email).toBe(input.email)
		expect(result.address).toBe(input.address)
		expect(result.createdAt).toBeDefined()
		expect(result.updatedAt).toBeDefined()
	})
})
