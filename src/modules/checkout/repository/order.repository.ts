import Id from '../../@shared/domain/value-object/id.value-object'
import Address from '../../@shared/domain/value-object/address.value-object'
import Client from '../domain/client.entity'
import Order from '../domain/order.entity'
import Product from '../domain/product.entity'
import CheckoutGateway from '../gateway/checkout.gateway'
import { OrderModel } from './order.model'

export default class OrderRepository implements CheckoutGateway {
	async addOrder(order: Order): Promise<void> {
		await OrderModel.create({
			id: order.id.value,
			clientId: order.client.id.value,
			clientName: order.client.name,
			clientEmail: order.client.email,
			clientAddress: {
				street: order.client.address.street,
				number: order.client.address.number,
				complement: order.client.address.complement,
				city: order.client.address.city,
				state: order.client.address.state,
				zipCode: order.client.address.zipCode,
			},
			products: order.products.map((product) => ({
				id: product.id.value,
				name: product.name,
				description: product.description,
				salesPrice: product.salesPrice,
			})),
			status: order.status,
			createdAt: order.createdAt,
			updatedAt: order.updatedAt,
		})
	}

	async findOrder(id: string): Promise<Order | null> {
		const order = await OrderModel.findOne({ where: { id } })

		if (!order) {
			return null
		}

		const client = new Client({
			id: new Id(order.clientId),
			name: order.clientName,
			email: order.clientEmail,
			address: new Address({
				street: order.clientAddress.street,
				number: order.clientAddress.number,
				complement: order.clientAddress.complement,
				city: order.clientAddress.city,
				state: order.clientAddress.state,
				zipCode: order.clientAddress.zipCode,
			}),
		})

		const products = order.products.map(
			(product) =>
				new Product({
					id: new Id(product.id),
					name: product.name,
					description: product.description,
					salesPrice: product.salesPrice,
				})
		)

		return new Order({
			id: new Id(order.id),
			client,
			products,
			status: order.status,
		})
	}
}
