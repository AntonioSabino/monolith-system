import { Sequelize } from 'sequelize-typescript'
import { InvoiceModel } from './invoice.model'
import InvoiceItemModel from './invoice-item.model'
import Invoice from '../domain/invoice.entity'
import Id from '../../@shared/domain/value-object/id.value-object'
import Address from '../../@shared/domain/value-object/address.value-object'
import InvoiceItem from '../domain/invoice-item.entity'
import InvoiceRepository from './invoice.repository'

describe('InvoiceRepository tests', () => {
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

	it('should save an invoice', async () => {
		const invoice = new Invoice({
			id: new Id('1'),
			name: 'Cliente 1',
			document: '123456789',
			address: new Address({
				street: 'Rua A',
				number: '100',
				complement: 'Apto 10',
				city: 'Cidade',
				state: 'Estado',
				zipCode: '00000-000',
			}),
			items: [
				new InvoiceItem({
					id: new Id('item1'),
					name: 'Produto 1',
					price: 50,
				}),
				new InvoiceItem({
					id: new Id('item2'),
					name: 'Produto 2',
					price: 75,
				}),
			],
			createdAt: new Date(),
			updatedAt: new Date(),
		})

		const invoiceRepository = new InvoiceRepository()
		const result = await invoiceRepository.save(invoice)

		expect(result.id.value).toBe('1')
		expect(result.name).toBe('Cliente 1')
		expect(result.document).toBe('123456789')
		expect(result.address.street).toBe('Rua A')
		expect(result.items.length).toBe(2)
		expect(result.total).toBe(125)
	})

	it('should find an invoice', async () => {
		await InvoiceModel.create(
			{
				id: '1',
				name: 'Cliente 1',
				document: '123456789',
				street: 'Rua A',
				number: '100',
				complement: 'Apto 10',
				city: 'Cidade',
				state: 'Estado',
				zipCode: '00000-000',
				total: 125,
				createdAt: new Date(),
				updatedAt: new Date(),
				items: [
					{ id: 'item1', name: 'Produto 1', price: 50, invoiceId: '1' },
					{ id: 'item2', name: 'Produto 2', price: 75, invoiceId: '1' },
				],
			},
			{ include: [InvoiceItemModel] }
		)

		const invoiceRepository = new InvoiceRepository()
		const result = await invoiceRepository.find('1')

		expect(result.id.value).toBe('1')
		expect(result.name).toBe('Cliente 1')
		expect(result.document).toBe('123456789')
		expect(result.address.street).toBe('Rua A')
		expect(result.items.length).toBe(2)
		expect(result.total).toBe(125)
	})

	it('should throw an error when invoice not found', async () => {
		const invoiceRepository = new InvoiceRepository()
		await expect(invoiceRepository.find('non-existent-id')).rejects.toThrow(
			'Invoice not found'
		)
	})
})
