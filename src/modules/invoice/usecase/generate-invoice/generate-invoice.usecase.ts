import Address from '../../../@shared/domain/value-object/address.value-object'
import Id from '../../../@shared/domain/value-object/id.value-object'
import InvoiceItem from '../../domain/invoice-item.entity'
import Invoice from '../../domain/invoice.entity'
import InvoiceGateway from '../../gateway/invoice.gateway'
import {
	GenerateInvoiceUseCaseInputDto,
	GenerateInvoiceUseCaseOutputDto,
} from './generate-invoice.dto'

export default class GenerateInvoiceUseCase {
	constructor(private invoiceRepository: InvoiceGateway) {}

	async execute(
		input: GenerateInvoiceUseCaseInputDto
	): Promise<GenerateInvoiceUseCaseOutputDto> {
		const invoice = new Invoice({
			id: new Id(),
			name: input.name,
			document: input.document,
			address: new Address({
				street: input.street,
				number: input.number,
				complement: input.complement,
				city: input.city,
				state: input.state,
				zipCode: input.zipCode,
			}),
			items: input.items.map(
				(item) =>
					new InvoiceItem({
						id: new Id(),
						name: item.name,
						price: item.price,
					})
			),
		})

		const persistInvoice = await this.invoiceRepository.save(invoice)

		return {
			id: persistInvoice.id.value,
			name: persistInvoice.name,
			document: persistInvoice.document,
			street: persistInvoice.address.street,
			number: persistInvoice.address.number,
			complement: persistInvoice.address.complement,
			city: persistInvoice.address.city,
			state: persistInvoice.address.state,
			zipCode: persistInvoice.address.zipCode,
			items: persistInvoice.items.map((item) => ({
				id: item.id.value,
				name: item.name,
				price: item.price,
			})),
			total: persistInvoice.total,
		}
	}
}
