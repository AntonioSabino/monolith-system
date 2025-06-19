import Id from '../../@shared/domain/value-object/id.value-object'
import Product from '../domain/product.entity'
import ProductGateway from '../gateway/product.gateway'
import ProductModel from './product.model'

export default class ProductRepository implements ProductGateway {
	async add(product: Product): Promise<void> {
		await ProductModel.create({
			id: product.id.value,
			name: product.name,
			description: product.description,
			purchasePrice: product.purchasePrice,
			stock: product.stock,
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
		})
	}

	async find(id: string): Promise<Product> {
		const productModel = await ProductModel.findByPk(id)

		if (!productModel) {
			throw new Error('Product not found')
		}

		return new Product({
			id: new Id(productModel.id),
			name: productModel.name,
			description: productModel.description,
			purchasePrice: productModel.purchasePrice,
			stock: productModel.stock,
			createdAt: productModel.createdAt,
			updatedAt: productModel.updatedAt,
		})
	}
}
