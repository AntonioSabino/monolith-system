import ClientAdmFacadeFactory from '../../client-adm/factory/client-adm.facade.factory'
import InvoiceFacadeFactory from '../../invoice/factory/invoice.facade.factory'
import PaymentFacadeFactory from '../../payment/factory/payment.facade.factory'
import ProductAdmFacadeFactory from '../../product-adm/factory/facade.factory'
import StoreCatalogFacadeFactory from '../../store-catalog/factory/facade.factory'
import CheckoutFacade from '../facade/checkout.facade'
import OrderRepository from '../repository/order.repository'
import PlaceOrderUseCase from '../usecase/place-order/place-order.usecase'

export default class CheckoutFacadeFactory {
	static create(): CheckoutFacade {
		const clientFacade = ClientAdmFacadeFactory.create()
		const productFacade = ProductAdmFacadeFactory.create()
		const catalogFacade = StoreCatalogFacadeFactory.create()
		const orderRepository = new OrderRepository()
		const invoiceFacade = InvoiceFacadeFactory.create()
		const paymentFacade = PaymentFacadeFactory.create()

		const placeOrderUseCase = new PlaceOrderUseCase(
			clientFacade,
			productFacade,
			catalogFacade,
			orderRepository,
			invoiceFacade,
			paymentFacade
		)

		const checkoutFacade = new CheckoutFacade({
			placeOrderUseCase,
		})

		return checkoutFacade
	}
}
