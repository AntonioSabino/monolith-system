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
	private addUseCase: UseCaseInterface
	private stockUseCase: UseCaseInterface

	constructor({ addUseCase, stockUseCase }: UseCasesProps) {
		this.addUseCase = addUseCase
		this.stockUseCase = stockUseCase
	}

	async addProduct(input: AddProductFacadeInputDto): Promise<void> {
		await this.addUseCase.execute(input)
	}

	async checkStock(
		input: CheckStockFacadeInputDto
	): Promise<CheckStockFacadeOutputDto> {
		return await this.stockUseCase.execute(input)
	}
}
