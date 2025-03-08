import Id from '../../../@shared/domain/value-object/id.value-object'
import Transaction from '../../domain/transaction.entity'
import ProcessPaymentUseCase from './process-payment.usecase'

const transaction = new Transaction({
	id: new Id('1'),
	amount: 100,
	orderId: '1',
	status: 'approved',
})

const transaction2 = new Transaction({
	id: new Id('2'),
	amount: 50,
	orderId: '2',
	status: 'declined',
})

const MockRepositoryApproved = () => {
	return {
		save: jest.fn().mockReturnValue(Promise.resolve(transaction)),
	}
}

const MockRepositoryDeclined = () => {
	return {
		save: jest.fn().mockReturnValue(Promise.resolve(transaction2)),
	}
}

describe('ProcessPayment', () => {
	it('should process payment', async () => {
		const repository = MockRepositoryApproved()
		const usecase = new ProcessPaymentUseCase(repository)
		const result = await usecase.execute({
			amount: 100,
			orderId: '1',
		})

		expect(repository.save).toBeCalledTimes(1)
		expect(result.transactionId).toBe(transaction.id.value)
		expect(result.status).toBe(transaction.status)
		expect(result.amount).toBe(transaction.amount)
		expect(result.orderId).toBe(transaction.orderId)
		expect(result.createdAt).toBe(transaction.createdAt)
		expect(result.updatedAt).toBe(transaction.updatedAt)
	})

	it('should decline payment', async () => {
		const repository = MockRepositoryDeclined()
		const usecase = new ProcessPaymentUseCase(repository)
		const result = await usecase.execute({
			amount: 50,
			orderId: '2',
		})

		expect(repository.save).toBeCalledTimes(1)
		expect(result.transactionId).toBe(transaction2.id.value)
		expect(result.status).toBe(transaction2.status)
		expect(result.amount).toBe(transaction2.amount)
		expect(result.orderId).toBe(transaction2.orderId)
		expect(result.createdAt).toBe(transaction2.createdAt)
	})
})
