import { or } from 'sequelize'
import Id from '../../../@shared/domain/value-object/id.value-object'
import Product from '../../domain/product.entity'
import { PlaceOrderInputDto } from './place-order.dto'
import PlaceOrderUseCase from './place-order.usecase'

const mockDate = new Date(2000, 1, 1)

describe('PlaceOrderUseCase', () => {
	describe('validateProducts method', () => {
		// @ts-expect-error - no params in constructor
		const placeOrderUseCase = new PlaceOrderUseCase()
		it('should throw an error when no products are selected', async () => {
			const input: PlaceOrderInputDto = {
				clientId: '1',
				products: [],
			}

			await expect(
				placeOrderUseCase['validateProducts'](input)
			).rejects.toThrow(new Error('No products selected'))
		})

		it('should throw an error when products is out of stock', async () => {
			const mockProductFacade = {
				checkStock: jest.fn(({ productId }: { productId: string }) => {
					if (productId === '0') {
						return Promise.resolve({ productId, stock: 1 })
					}
					return Promise.resolve({ productId, stock: 0 })
				}),
			}

			// @ts-expect-error - force set productFacade
			placeOrderUseCase['_productFacade'] = mockProductFacade

			let input: PlaceOrderInputDto = {
				clientId: '0',
				products: [{ productId: '1' }],
			}

			await expect(
				placeOrderUseCase['validateProducts'](input)
			).rejects.toThrow(new Error('Product 1 is not available in stock'))

			input = {
				clientId: '0',
				products: [{ productId: '0' }, { productId: '1' }],
			}

			await expect(
				placeOrderUseCase['validateProducts'](input)
			).rejects.toThrow(new Error('Product 1 is not available in stock'))
			expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3)

			input = {
				clientId: '0',
				products: [{ productId: '0' }, { productId: '1' }, { productId: '2' }],
			}

			await expect(
				placeOrderUseCase['validateProducts'](input)
			).rejects.toThrow(new Error('Product 1 is not available in stock'))
			expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5)
		})
	})

	describe('getProducts method', () => {
		beforeAll(() => {
			jest.useFakeTimers('modern')
			jest.setSystemTime(mockDate)
		})

		afterAll(() => {
			jest.useRealTimers()
		})

		// @ts-expect-error - no params in constructor
		const placeOrderUseCase = new PlaceOrderUseCase()

		it('should throw an error when no product not found', async () => {
			const mockCatalogFacade = {
				find: jest.fn().mockResolvedValue(null),
			}
			// @ts-expect-error - force set catalogFacade
			placeOrderUseCase['_catalogFacade'] = mockCatalogFacade

			await expect(placeOrderUseCase['getProduct']('0')).rejects.toThrow(
				new Error('Product not found')
			)
		})

		it('should return a product', async () => {
			const mockCatalogFacade = {
				find: jest.fn().mockResolvedValue({
					id: '0',
					name: 'Product 0',
					description: 'Description 0',
					salesPrice: 100,
				}),
			}

			// @ts-expect-error - force set catalogFacade
			placeOrderUseCase['_catalogFacade'] = mockCatalogFacade

			await expect(placeOrderUseCase['getProduct']('0')).resolves.toEqual(
				new Product({
					id: new Id('0'),
					name: 'Product 0',
					description: 'Description 0',
					salesPrice: 100,
				})
			)

			expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1)
		})
	})

	describe('execute method', () => {
		beforeAll(() => {
			jest.useFakeTimers('modern')
			jest.setSystemTime(mockDate)
		})

		afterAll(() => {
			jest.useRealTimers()
		})

		it('should throw an error when client not found', async () => {
			const mockClientFacade = {
				find: jest.fn().mockResolvedValue(null),
			}

			// @ts-expect-error - no params in constructor
			const placeOrderUseCase = new PlaceOrderUseCase()
			// @ts-expect-error - force set clientFacade
			placeOrderUseCase['_clientFacade'] = mockClientFacade

			const input: PlaceOrderInputDto = {
				clientId: '0',
				products: [],
			}

			await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
				new Error('Client not found')
			)
		})

		it('should throw an error when products are not valid', async () => {
			const mockClientFacade = {
				find: jest.fn().mockResolvedValue(true),
			}

			// @ts-expect-error - no params in constructor
			const placeOrderUseCase = new PlaceOrderUseCase()

			const mockValidateProducts = jest
				// @ts-expect-error - spy on a private method
				.spyOn(placeOrderUseCase, 'validateProducts')
				// @ts-expect-error - not return never
				.mockRejectedValue(new Error('No products selected'))

			// @ts-expect-error - force set clientFacade
			placeOrderUseCase['_clientFacade'] = mockClientFacade
			const input: PlaceOrderInputDto = {
				clientId: '1',
				products: [],
			}

			await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
				new Error('No products selected')
			)
			expect(mockValidateProducts).toHaveBeenCalledWith(input)
			expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
		})

		describe('place an order', () => {
			const clientProps = {
				id: '1c',
				name: 'Client 1',
				document: '12345678901',
				email: 'client1@example.com',
				street: 'Client Street',
				number: '123',
				complement: 'Apt 1',
				city: 'Client City',
				state: 'CS',
				zipCode: '12345-678',
			}

			const mockClientFacade = {
				find: jest.fn().mockResolvedValue(clientProps),
				add: jest.fn(),
			}

			const mockPaymentFacade = {
				process: jest.fn(),
			}

			const mockCheckoutRepository = {
				addOrder: jest.fn(),
				findOrder: jest.fn(),
			}

			const mockInvoiceFacade = {
				generate: jest.fn().mockResolvedValue({ id: '1i' }),
				find: jest.fn(),
			}

			const placeOrderUseCase = new PlaceOrderUseCase(
				mockClientFacade,
				null,
				null,
				mockCheckoutRepository,
				mockInvoiceFacade,
				mockPaymentFacade
			)

			const products = {
				'1': new Product({
					id: new Id('1'),
					name: 'Product 1',
					description: 'Description 1',
					salesPrice: 100,
				}),
				'2': new Product({
					id: new Id('2'),
					name: 'Product 2',
					description: 'Description 2',
					salesPrice: 200,
				}),
			}

			const mockValidateProducts = jest
				// @ts-expect-error - spy on a private method
				.spyOn(placeOrderUseCase, 'validateProducts')
				// @ts-expect-error - not return never
				.mockResolvedValue(null)

			const mockGetProduct = jest
				// @ts-expect-error - spy on a private method
				.spyOn(placeOrderUseCase, 'getProduct')
				// @ts-expect-error - not return never
				.mockImplementation((productId: keyof typeof products) => {
					return Promise.resolve(products[productId])
				})

			it('should not be approved', async () => {
				mockPaymentFacade.process = mockPaymentFacade.process.mockResolvedValue(
					{
						transactionId: '1t',
						orderId: '1o',
						amount: 300,
						status: 'error',
						createdAt: new Date(),
						updatedAt: new Date(),
					}
				)

				const input: PlaceOrderInputDto = {
					clientId: clientProps.id,
					products: [{ productId: '1' }, { productId: '2' }],
				}

				let output = await placeOrderUseCase.execute(input)

				expect(output.invoiceId).toBeNull()
				expect(output.total).toBe(300)
				expect(output.products).toStrictEqual([
					{ productId: '1' },
					{ productId: '2' },
				])
				expect(mockClientFacade.find).toHaveBeenCalledTimes(1)
				expect(mockValidateProducts).toHaveBeenCalledWith(input)
				expect(mockValidateProducts).toHaveBeenCalledTimes(1)
				expect(mockValidateProducts).toHaveBeenCalledWith(input)
				expect(mockGetProduct).toHaveBeenCalledTimes(2)
				expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1)
				expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1)
				expect(mockPaymentFacade.process).toHaveBeenCalledWith({
					orderId: output.id,
					amount: output.total,
				})

				expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0)
			})
		})
	})
})
