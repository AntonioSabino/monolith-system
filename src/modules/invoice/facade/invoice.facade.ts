import InvoiceFacadeInterface, {
	GenerateInvoiceFacadeInputDto,
	GenerateInvoiceFacadeOutputDto,
	FindInvoiceFacadeInputDto,
	FindInvoiceFacadeOutputDto,
} from './invoice.facade.interface'
import FindInvoiceUseCase from '../usecase/find-invoice/find-invoice.usecase'
import GenerateInvoiceUseCase from '../usecase/generate-invoice/generate-invoice.usecase'

export interface InvoiceFacadeProps {
	findUseCase: FindInvoiceUseCase
	generateUseCase: GenerateInvoiceUseCase
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
	private _findUseCase: FindInvoiceUseCase
	private _generateUseCase: GenerateInvoiceUseCase

	constructor(props: InvoiceFacadeProps) {
		this._findUseCase = props.findUseCase
		this._generateUseCase = props.generateUseCase
	}

	async generate(
		input: GenerateInvoiceFacadeInputDto
	): Promise<GenerateInvoiceFacadeOutputDto> {
		return await this._generateUseCase.execute(input)
	}

	async find(
		input: FindInvoiceFacadeInputDto
	): Promise<FindInvoiceFacadeOutputDto> {
		return await this._findUseCase.execute(input)
	}
}
