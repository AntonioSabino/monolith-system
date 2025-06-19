import { PlaceOrderInputDto } from '../usecase/place-order/place-order.dto'
import PlaceOrderUseCase from '../usecase/place-order/place-order.usecase'
import CheckoutFacade from './checkout.facade'

const mockPlaceOrderUseCase = () => {
	return {
		execute: jest.fn().mockResolvedValue({
			id: '1',
			invoiceId: 'any_invoice_id',
			status: 'approved',
			total: 100,
			products: [{ productId: '1' }],
		}),
	}
}

describe('CheckoutFacade tests', () => {
	it('should create a order', async () => {
		const placeOrderUseCase = mockPlaceOrderUseCase() as any
		const facade = new CheckoutFacade({
			placeOrderUseCase: placeOrderUseCase,
		})

		const input = {
			clientId: '1',
			products: [{ productId: '1' }],
		}

		const output = await facade.placeOrder(input)

		expect(placeOrderUseCase.execute).toHaveBeenCalledWith(input)
		expect(output.id).toBe('1')
		expect(output.invoiceId).toBe('any_invoice_id')
		expect(output.status).toBe('approved')
		expect(output.total).toBe(100)
		expect(output.products).toEqual([{ productId: '1' }])
	})
})
