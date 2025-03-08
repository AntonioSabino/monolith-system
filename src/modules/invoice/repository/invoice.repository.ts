import Address from '../../@shared/domain/value-object/address.value-object'
import Id from '../../@shared/domain/value-object/id.value-object'
import InvoiceItem from '../domain/invoice-item.entity'
import Invoice from '../domain/invoice.entity'
import InvoiceGateway from '../gateway/invoice.gateway'
import InvoiceItemModel from './invoice-item.model'
import { InvoiceModel } from './invoice.model'

export default class InvoiceRepository implements InvoiceGateway {
	async find(id: string): Promise<Invoice> {
		const invoice = await InvoiceModel.findOne({
			where: { id },
			include: InvoiceModel.associations.items,
		})

		if (!invoice) {
			throw new Error('Invoice not found')
		}

		const items = invoice.items.map(
			(item) =>
				new InvoiceItem({
					id: new Id(item.id),
					name: item.name,
					price: item.price,
				})
		)

		const address = new Address({
			street: invoice.street,
			number: invoice.number,
			complement: invoice.complement,
			city: invoice.city,
			state: invoice.state,
			zipCode: invoice.zipCode,
		})

		return new Invoice({
			id: new Id(invoice.id),
			name: invoice.name,
			document: invoice.document,
			address: address,
			items: items,
			createdAt: invoice.createdAt,
			updatedAt: invoice.updatedAt,
		})
	}

	async save(invoice: Invoice): Promise<Invoice> {
		await InvoiceModel.create(
			{
				id: invoice.id.value,
				name: invoice.name,
				document: invoice.document,
				street: invoice.address.street,
				number: invoice.address.number,
				complement: invoice.address.complement,
				city: invoice.address.city,
				state: invoice.address.state,
				zipCode: invoice.address.zipCode,
				total: invoice.total,
				createdAt: invoice.createdAt,
				updatedAt: invoice.updatedAt,
				items: invoice.items.map((item) => ({
					id: item.id.value,
					name: item.name,
					price: item.price,
					invoiceId: invoice.id.value,
				})),
			},
			{
				include: [InvoiceItemModel],
			}
		)

		return invoice
	}
}
