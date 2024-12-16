import ProductGateway from '../../gateway/product.gateway'
import { FindProductInputDto, FindProductOutputDto } from './find-product.dto'

export default class FindProductUseCase {
	constructor(private productRepository: ProductGateway) {}

	async execute(inputDto: FindProductInputDto): Promise<FindProductOutputDto> {
		const product = await this.productRepository.find(inputDto.id)

		return {
			id: product.id.value,
			name: product.name,
			description: product.description,
			salesPrice: product.salesPrice,
		}
	}
}
