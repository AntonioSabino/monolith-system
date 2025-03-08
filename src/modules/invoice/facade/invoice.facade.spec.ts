import { Sequelize } from 'sequelize-typescript'
import { InvoiceModel } from '../repository/invoice.model'
import InvoiceItemModel from '../repository/invoice-item.model'
import InvoiceFacadeFactory from '../factory/invoice.facade.factory'

describe('InvoiceFacade tests', () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		})

		sequelize.addModels([InvoiceModel, InvoiceItemModel])
		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it('should generate an invoice', async () => {
		const facade = InvoiceFacadeFactory.create()

		const input = {
			name: 'Client 1',
			document: 'doc123',
			street: 'Rua 1',
			number: '100',
			complement: 'Apt 1',
			city: 'Cidade X',
			state: 'Estado Y',
			zipCode: '12345-678',
			items: [
				{ id: 'item1', name: 'Item 1', price: 50 },
				{ id: 'item2', name: 'Item 2', price: 75 },
			],
		}

		const output = await facade.generate(input)

		expect(output.id).toBeDefined()
		expect(output.name).toBe(input.name)
		expect(output.document).toBe(input.document)
		expect(output.street).toBe(input.street)
		expect(output.number).toBe(input.number)
		expect(output.complement).toBe(input.complement)
		expect(output.city).toBe(input.city)
		expect(output.state).toBe(input.state)
		expect(output.zipCode).toBe(input.zipCode)
		expect(output.items).toHaveLength(2)
		expect(output.total).toBe(125)
	})

	it('should find an invoice', async () => {
		const facade = InvoiceFacadeFactory.create()

		const now = new Date()
		await InvoiceModel.create(
			{
				id: '1',
				name: 'Client 1',
				document: 'doc123',
				street: 'Rua 1',
				number: '100',
				complement: 'Apt 1',
				city: 'Cidade X',
				state: 'Estado Y',
				zipCode: '12345-678',
				total: 125,
				createdAt: now,
				updatedAt: now,
				items: [
					{ id: 'item1', name: 'Item 1', price: 50, invoiceId: '1' },
					{ id: 'item2', name: 'Item 2', price: 75, invoiceId: '1' },
				],
			},
			{ include: [InvoiceItemModel] }
		)

		const output = await facade.find({ id: '1' })

		expect(output.id).toBe('1')
		expect(output.name).toBe('Client 1')
		expect(output.document).toBe('doc123')
		expect(output.address.street).toBe('Rua 1')
		expect(output.address.number).toBe('100')
		expect(output.address.complement).toBe('Apt 1')
		expect(output.address.city).toBe('Cidade X')
		expect(output.address.state).toBe('Estado Y')
		expect(output.address.zipCode).toBe('12345-678')
		expect(output.items).toHaveLength(2)
		expect(output.total).toBe(125)
	})

	it('should throw an error if invoice not found', async () => {
		const facade = InvoiceFacadeFactory.create()

		await expect(facade.find({ id: 'non-existent' })).rejects.toThrow(
			'Invoice not found'
		)
	})
})
