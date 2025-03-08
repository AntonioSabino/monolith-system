import UseCaseInterface from '../../../@shared/usecase/use-case.interface'
import InvoiceItem from '../../domain/invoice-item.entity'
import InvoiceGateway from '../../gateway/invoice.gateway'
import {
	FindInvoiceUseCaseInputDTO,
	FindInvoiceUseCaseOutputDTO,
} from './find-invoice.dto'

export default class FindInvoiceUseCase implements UseCaseInterface {
	constructor(private invoiceRepository: InvoiceGateway) {}

	async execute(
		inputDto: FindInvoiceUseCaseInputDTO
	): Promise<FindInvoiceUseCaseOutputDTO> {
		const invoice = await this.invoiceRepository.find(inputDto.id)

		return {
			id: invoice.id.value,
			name: invoice.name,
			document: invoice.document,
			address: {
				street: invoice.address.street,
				number: invoice.address.number,
				complement: invoice.address.complement,
				city: invoice.address.city,
				state: invoice.address.state,
				zipCode: invoice.address.zipCode,
			},
			items: invoice.items.map((item: InvoiceItem) => ({
				id: item.id.value,
				name: item.name,
				price: item.price,
			})),
			total: invoice.total,
			createdAt: invoice.createdAt,
		}
	}
}
