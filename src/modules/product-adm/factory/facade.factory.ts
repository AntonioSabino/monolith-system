import ProductAdmFacade from '../facade/product-adm.facade'
import ProductRepository from '../repository/product.repository'
import AddProductUsecase from '../usecase/add-product/add-product.usecase'
import CheckStockUseCase from '../usecase/check-stock/check-stock.usecase'

export default class ProductAdmFacadeFactory {
	static create(): ProductAdmFacade {
		const productRepository = new ProductRepository()
		const addProductUseCase = new AddProductUsecase(productRepository)
		const checkStockUseCase = new CheckStockUseCase(productRepository)
		const productAdmFacade = new ProductAdmFacade({
			addUseCase: addProductUseCase,
			stockUseCase: checkStockUseCase,
		})

		return productAdmFacade
	}
}
