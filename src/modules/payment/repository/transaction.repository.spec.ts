import { Sequelize } from 'sequelize-typescript'
import Id from '../../@shared/domain/value-object/id.value-object'
import Transaction from '../domain/transaction.entity'
import TransactionRepostiory from './transaction.repository'
import TransactionModel from './transaction.model'

describe('TransactionRepository test', () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		})

		sequelize.addModels([TransactionModel])
		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it('should save a transaction', async () => {
		const transaction = new Transaction({
			id: new Id('1'),
			amount: 100,
			orderId: '1',
		})
		transaction.approve()

		const repository = new TransactionRepostiory()
		const result = await repository.save(transaction)

		expect(result.id.value).toBe(transaction.id.value)
		expect(result.status).toBe('approved')
		expect(result.amount).toBe(transaction.amount)
		expect(result.orderId).toBe(transaction.orderId)
	})
})
