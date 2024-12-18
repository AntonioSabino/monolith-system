import Id from '../../../@shared/domain/value-object/id.value-object'
import Client from '../../domain/client.entity'
import FindClientUseCase from './find-client.usecase'

const client = new Client({
	id: new Id('1'),
	name: 'any_name',
	email: 'any@mail.com',
	address: 'any_address',
})

const MockRepository = () => {
	return {
		add: jest.fn(),
		find: jest.fn().mockReturnValue(Promise.resolve(client)),
	}
}

describe('FindClientUsecase', () => {
	it('should find a client', async () => {
		const repository = MockRepository()
		const usecase = new FindClientUseCase(repository)

		const input = {
			id: '1',
		}

		const result = await usecase.execute(input)

		expect(repository.find).toHaveBeenCalled()
		expect(result.id).toBe(client.id.value)
		expect(result.name).toBe(client.name)
		expect(result.email).toBe(client.email)
		expect(result.address).toBe(client.address)
		expect(result.createdAt).toBe(client.createdAt)
		expect(result.updatedAt).toBe(client.updatedAt)
	})
})
