import { Sequelize } from 'sequelize-typescript'
import Id from '../../@shared/domain/value-object/id.value-object'
import Address from '../../@shared/domain/value-object/address.value-object'
import Client from '../domain/client.entity'
import Order from '../domain/order.entity'
import Product from '../domain/product.entity'
import { OrderModel } from './order.model'
import OrderRepository from './order.repository'

describe('OrderRepository test', () => {
	let sequelize: Sequelize

	beforeEach(async () => {
		sequelize = new Sequelize({
			dialect: 'sqlite',
			storage: ':memory:',
			logging: false,
			sync: { force: true },
		})

		await sequelize.addModels([OrderModel])
		await sequelize.sync()
	})

	afterEach(async () => {
		await sequelize.close()
	})

	it('should save an order', async () => {
		const client = new Client({
			id: new Id('1'),
			name: 'Client 1',
			email: 'client@example.com',
			address: new Address({
				street: 'Street 1',
				number: '123',
				complement: 'Complement 1',
				city: 'City 1',
				state: 'State 1',
				zipCode: '12345-678',
			}),
		})

		const product = new Product({
			id: new Id('1'),
			name: 'Product 1',
			description: 'Description 1',
			salesPrice: 100,
		})

		const order = new Order({
			id: new Id('1'),
			client,
			products: [product],
		})

		const orderRepository = new OrderRepository()
		await orderRepository.addOrder(order)

		const orderModel = await OrderModel.findOne({
			where: { id: order.id.value },
		})

		expect(orderModel).toBeDefined()
		expect(orderModel.id).toBe(order.id.value)
		expect(orderModel.clientId).toBe(client.id.value)
		expect(orderModel.clientName).toBe(client.name)
		expect(orderModel.clientEmail).toBe(client.email)
		expect(orderModel.clientAddress.street).toBe(client.address.street)
		expect(orderModel.products[0].id).toBe(product.id.value)
		expect(orderModel.products[0].name).toBe(product.name)
		expect(orderModel.products[0].salesPrice).toBe(product.salesPrice)
		expect(orderModel.status).toBe('pending')
	})

	it('should find an order', async () => {
		const order = {
			id: '1',
			clientId: '1',
			clientName: 'Client 1',
			clientEmail: 'client@example.com',
			clientAddress: {
				street: 'Street 1',
				number: '123',
				complement: 'Complement 1',
				city: 'City 1',
				state: 'State 1',
				zipCode: '12345-678',
			},
			products: [
				{
					id: '1',
					name: 'Product 1',
					description: 'Description 1',
					salesPrice: 100,
				},
			],
			status: 'pending',
			createdAt: new Date(),
			updatedAt: new Date(),
		}

		await OrderModel.create(order)

		const orderRepository = new OrderRepository()
		const result = await orderRepository.findOrder('1')

		expect(result).toBeDefined()
		expect(result.id.value).toBe(order.id)
		expect(result.client.id.value).toBe(order.clientId)
		expect(result.client.name).toBe(order.clientName)
		expect(result.client.email).toBe(order.clientEmail)
		expect(result.client.address.street).toBe(order.clientAddress.street)
		expect(result.products[0].id.value).toBe(order.products[0].id)
		expect(result.products[0].name).toBe(order.products[0].name)
		expect(result.products[0].salesPrice).toBe(order.products[0].salesPrice)
		expect(result.status).toBe(order.status)
	})

	it('should return null when order not found', async () => {
		const orderRepository = new OrderRepository()
		const result = await orderRepository.findOrder('not-found')

		expect(result).toBeNull()
	})
})
