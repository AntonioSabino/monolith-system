import Id from '../../../@shared/domain/value-object/id.value-object'
import Client from '../../domain/client.entity'
import ClientGateway from '../../gateway/client.gateway'
import { addClientInputDto, addClientOutputDto } from './add-client.usecase.dto'

export default class AddClientUseCase {
	private _clientReposiotry: ClientGateway

	constructor(clientRepository: ClientGateway) {
		this._clientReposiotry = clientRepository
	}

	async execute(input: addClientInputDto): Promise<addClientOutputDto> {
		const props = {
			name: input.name,
			email: input.email,
			address: input.address,
		}

		const client = new Client(props)
		await this._clientReposiotry.add(client)

		return {
			id: client.id.value,
			name: client.name,
			email: client.email,
			address: client.address,
			createdAt: client.createdAt,
			updatedAt: client.updatedAt,
		}
	}
}
