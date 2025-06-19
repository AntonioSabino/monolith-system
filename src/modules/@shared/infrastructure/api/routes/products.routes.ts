import { Router } from 'express'
import ProductAdmFacadeFactory from '../../../../product-adm/factory/facade.factory'

const productsRouter = Router()
const productFacade = ProductAdmFacadeFactory.create()

productsRouter.post('/', async (req, res) => {
	try {
		const { id, name, description, purchasePrice, stock } = req.body

		if (
			!name ||
			!description ||
			purchasePrice === undefined ||
			stock === undefined
		) {
			return res.status(400).json({ error: 'Missing required fields' })
		}

		await productFacade.addProduct({
			id,
			name,
			description,
			purchasePrice,
			stock,
		})

		res.status(201).json({ message: 'Product created successfully' })
	} catch (error) {
		console.error('Error creating product:', error)
		res.status(500).json({ error: 'Failed to create product' })
	}
})

export default productsRouter
