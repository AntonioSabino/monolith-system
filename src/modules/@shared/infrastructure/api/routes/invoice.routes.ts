import { Router } from 'express'
import InvoiceFacadeFactory from '../../../../invoice/factory/invoice.facade.factory'

const invoiceRouter = Router()
const invoiceFacade = InvoiceFacadeFactory.create()

invoiceRouter.post('/', async (req, res) => {
	try {
		const {
			name,
			document,
			street,
			number,
			complement,
			city,
			state,
			zipCode,
			items,
		} = req.body

		if (
			!name ||
			!document ||
			!street ||
			!number ||
			!city ||
			!state ||
			!zipCode ||
			!items ||
			!Array.isArray(items) ||
			items.length === 0
		) {
			return res.status(400).json({ error: 'Missing required fields' })
		}

		for (const item of items) {
			if (!item.id || !item.name || item.price === undefined) {
				return res.status(400).json({ error: 'Invalid item structure' })
			}
		}

		const result = await invoiceFacade.generate({
			name,
			document,
			street,
			number,
			complement,
			city,
			state,
			zipCode,
			items,
		})

		res.status(201).json(result)
	} catch (error) {
		console.error('Error generating invoice:', error)
		res.status(500).json({ error: 'Failed to generate invoice' })
	}
})

invoiceRouter.get('/:id', async (req, res) => {
	try {
		const { id } = req.params

		if (!id) {
			return res.status(400).json({ error: 'Invoice ID is required' })
		}

		const invoice = await invoiceFacade.find({ id })

		res.status(200).json(invoice)
	} catch (error) {
		console.error('Error finding invoice:', error)
		res.status(500).json({ error: 'Failed to find invoice' })
	}
})

export default invoiceRouter
