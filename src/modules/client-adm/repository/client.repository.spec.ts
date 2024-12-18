import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from './client.model'
import ClientRepository from './client.repository'

describe('Client Repository test', () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		})

		sequelize.addModels([ClientModel])
		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it('should find a client', async () => {
		const client = await ClientModel.create({
			id: '1',
			name: 'Lucian',
			email: 'lucian@123.com',
			address: 'Rua 1',
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		const repository = new ClientRepository()
		const result = await repository.find(client.id)

		expect(result.id.value).toBeDefined()
		expect(result.name).toEqual(client.name)
		expect(result.email).toEqual(client.email)
		expect(result.address).toEqual(client.address)
		expect(result.createdAt).toStrictEqual(client.createdAt)
		expect(result.updatedAt).toStrictEqual(client.updatedAt)
	})
})
