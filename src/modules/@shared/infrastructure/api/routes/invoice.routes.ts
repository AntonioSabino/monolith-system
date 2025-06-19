import { Router } from 'express'

const invoiceRouter = Router()

// GET /invoice/:id
invoiceRouter.get('/:id', (req, res) => {
	// Implementar lógica de busca de invoice
	const { id } = req.params
	res.status(200).json({ message: `Invoice ${id} encontrada` })
})

export default invoiceRouter
