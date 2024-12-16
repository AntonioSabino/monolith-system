import UseCaseInterface from '../../@shared/usecase/use-case.interface'
import FindAllProductsUsecase from '../usecase/find-all-products/find-all-products.usecase'
import FindProductUseCase from '../usecase/find-product/find-product.usecase'
import StoreCatalogFacadeInterface, {
	FindAllStoreCatalogFacadeOutputDto,
	FindStoreCatalogFacadeInputDto,
	FindStoreCatalogFacadeOutputDto,
} from './store-catalog.facade.interface'

export interface UseCasesProps {
	findUseCase: FindProductUseCase
	findAllUseCase: FindAllProductsUsecase
}

export default class StoreCatalogFacade implements StoreCatalogFacadeInterface {
	private _find: FindProductUseCase
	private _findAll: FindAllProductsUsecase

	constructor({ findUseCase, findAllUseCase }: UseCasesProps) {
		this._find = findUseCase
		this._findAll = findAllUseCase
	}

	async find(
		input: FindStoreCatalogFacadeInputDto
	): Promise<FindStoreCatalogFacadeOutputDto> {
		return await this._find.execute(input)
	}

	async findAll(): Promise<FindAllStoreCatalogFacadeOutputDto> {
		return await this._findAll.execute()
	}
}
