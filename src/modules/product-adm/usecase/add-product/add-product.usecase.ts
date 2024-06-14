import Id from '../../../@shared/domain/value-object/id.value-object'
import Product from '../../domain/product.entity'
import ProductGateway from '../../gateway/product.gateway'
import { AddProductInputDto, AddProductOutputDto } from './add-product.dto'

export default class AddProductUsecase {
	private readonly _productRepository: ProductGateway

	constructor(productRepository: ProductGateway) {
		this._productRepository = productRepository
	}

	async execute(input: AddProductInputDto): Promise<AddProductOutputDto> {
		const props = {
			...input,
			id: new Id(input.id),
		}

		const product = new Product(props)
		await this._productRepository.add(product)

		return {
			id: product.id.value,
			name: product.name,
			description: product.description,
			purchasePrice: product.purchasePrice,
			stock: product.stock,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		}
	}
}
