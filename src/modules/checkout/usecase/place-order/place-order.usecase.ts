import UseCaseInterface from '../../../@shared/usecase/use-case.interface'
import ClientAdmFacadeInterface from '../../../client-adm/facade/client-adm.facade.interface'
import { PlaceOrderInputDto, PlaceOrderOutputDto } from './place-order.dto'

export default class PlaceOrderUseCase implements UseCaseInterface {
	private _clientFacade: ClientAdmFacadeInterface
	constructor(clientFacade: ClientAdmFacadeInterface) {
		this._clientFacade = clientFacade
	}

	async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
		const client = await this._clientFacade.find({ id: input.clientId })

		if (!client) {
			throw new Error('Client not found')
		}

		return {
			id: '',
			invoiceId: '',
			status: '',
			total: 0,
			products: [],
		}
	}
}
