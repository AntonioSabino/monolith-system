import Address from '../../../@shared/domain/value-object/address.value-object'
import Id from '../../../@shared/domain/value-object/id.value-object'
import InvoiceItem from '../../domain/invoice-item.entity'
import Invoice from '../../domain/invoice.entity'
import GenerateInvoiceUseCase from './generate-invoice.usecase'

const invoice = new Invoice({
	id: new Id('1'),
	name: 'John Doe',
	document: '123.456.789-00',
	address: new Address({
		street: 'Main Street',
		number: '123',
		complement: 'N/A',
		city: 'Mauá',
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
	find: jest.fn(),
	save: jest.fn().mockReturnValue(Promise.resolve(invoice)),
})

describe('generate invoice usecase unit test', () => {
	it('should generate an invoice', async () => {
		const repository = MockRepository()
		const generateInvoice = new GenerateInvoiceUseCase(repository)

		const input = {
			name: 'John Doe',
			document: '123.456.789-00',
			street: 'Main Street',
			number: '123',
			complement: 'N/A',
			city: 'Mauá',
			state: 'SP',
			zipCode: '12345-678',
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
		}

		const output = await generateInvoice.execute(input)

		expect(repository.save).toHaveBeenCalled()
		expect(output).toEqual({
			id: '1',
			name: 'John Doe',
			document: '123.456.789-00',
			street: 'Main Street',
			number: '123',
			complement: 'N/A',
			city: 'Mauá',
			state: 'SP',
			zipCode: '12345-678',
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
		})
	})
})
