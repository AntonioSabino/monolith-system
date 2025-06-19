import { Router } from 'express'

const checkoutRouter = Router()

// POST /checkout
checkoutRouter.post('/', (req, res) => {
	// Implementar lógica de checkout
	res.status(201).json({ message: 'Checkout realizado' })
})

export default checkoutRouter
