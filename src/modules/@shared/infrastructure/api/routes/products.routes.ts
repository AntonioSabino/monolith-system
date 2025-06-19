import { Router } from 'express'

const productsRouter = Router()

// POST /products
productsRouter.post('/', (req, res) => {
	// Implementar lógica de criação de produto
	res.status(201).json({ message: 'Produto criado' })
})

export default productsRouter
