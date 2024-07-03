import UseCaseInterface from '../../@shared/usecase/use-case.interface'
import ProductAdmFacadeInterface, {
	AddProductFacadeInputDto,
	CheckStockFacadeInputDto,
	CheckStockFacadeOutputDto,
} from './product-adm.facade.interface'

interface UseCasesProps {
	addUseCase: UseCaseInterface
	stockUseCase: UseCaseInterface
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
	private _addUseCase: UseCaseInterface
	private _stockUseCase: UseCaseInterface

	constructor({ addUseCase, stockUseCase }: UseCasesProps) {
		this._addUseCase = addUseCase
		this._stockUseCase = stockUseCase
	}

	async addProduct(input: AddProductFacadeInputDto): Promise<void> {
		await this._addUseCase.execute(input)
	}

	async checkStock(
		input: CheckStockFacadeInputDto
	): Promise<CheckStockFacadeOutputDto> {
		return await this._stockUseCase.execute(input)
	}
}
