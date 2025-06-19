import PlaceOrderUseCase from '../usecase/place-order/place-order.usecase'
import CheckoutFacadeInterface, {
	PlaceOrderFacadeInputDto,
	PlaceOrderFacadeOutputDto,
} from './checkout.facade.interface'

export interface CheckoutFacadeProps {
	placeOrderUseCase: PlaceOrderUseCase
}

export default class CheckoutFacade implements CheckoutFacadeInterface {
	private _placeOrderUseCase: PlaceOrderUseCase

	constructor(props: CheckoutFacadeProps) {
		this._placeOrderUseCase = props.placeOrderUseCase
	}

	async placeOrder(
		input: PlaceOrderFacadeInputDto
	): Promise<PlaceOrderFacadeOutputDto> {
		return await this._placeOrderUseCase.execute(input)
	}
}
