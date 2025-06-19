import { Router } from 'express'
import CheckoutFacadeFactory from '../../../../checkout/factory/checkout.facade.factory'

const checkoutRouter = Router()
const checkoutFacade = CheckoutFacadeFactory.create()

// POST /checkout
checkoutRouter.post('/', async (req, res) => {
	try {
		const { clientId, products } = req.body

		if (
			!clientId ||
			!products ||
			!Array.isArray(products) ||
			products.length === 0
		) {
			return res.status(400).json({ error: 'Missing required fields' })
		}

		// Validar estrutura dos produtos
		for (const product of products) {
			if (!product.productId) {
				return res
					.status(400)
					.json({ error: 'Invalid product structure. Product ID is required.' })
			}
		}

		const output = await checkoutFacade.placeOrder({
			clientId,
			products,
		})

		res.status(201).json(output)
	} catch (error) {
		console.error('Error processing order:', error)
		res.status(500).json({ error: 'Failed to process order' })
	}
})

export default checkoutRouter
