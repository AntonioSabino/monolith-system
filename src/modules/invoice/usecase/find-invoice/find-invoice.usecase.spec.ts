import Address from '../../../@shared/domain/value-object/address.value-object'
import Id from '../../../@shared/domain/value-object/id.value-object'
import InvoiceItem from '../../domain/invoice-item.entity'
import Invoice from '../../domain/invoice.entity'
import FindInvoiceUseCase from './find-invoice.usecase'

const invoice = new Invoice({
	id: new Id('1'),
	name: 'John Doe',
	document: '123.456.789-00',
	address: new Address({
		street: 'Main Street',
		number: '123',
		complement: 'Near the park',
		city: 'Springfield',
		state: 'SP',
		zipCode: '12345-678',
	}),
	items: [
		new InvoiceItem({
			id: new Id('1'),
			name: 'Product 1',
			price: 100,
		}),
		new InvoiceItem({
			id: new Id('2'),
			name: 'Product 2',
			price: 200,
		}),
	],
})

const MockRepository = () => ({
	find: jest.fn().mockResolvedValue(invoice),
	save: jest.fn(),
})

describe('find an invoice usecase unit test', () => {
	it('should find an invoice', async () => {
		const repository = MockRepository()
		const findInvoice = new FindInvoiceUseCase(repository)
		const input = { id: '1' }
		const output = await findInvoice.execute(input)

		expect(repository.find).toHaveBeenCalled()
		expect(output).toEqual({
			id: '1',
			name: 'John Doe',
			document: '123.456.789-00',
			address: {
				street: 'Main Street',
				number: '123',
				complement: 'Near the park',
				city: 'Springfield',
				state: 'SP',
				zipCode: '12345-678',
			},
			items: [
				{
					id: '1',
					name: 'Product 1',
					price: 100,
				},
				{
					id: '2',
					name: 'Product 2',
					price: 200,
				},
			],
			total: 300,
			createdAt: invoice.createdAt,
		})
	})
})
