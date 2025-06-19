import { Router } from 'express'
import ClientAdmFacadeFactory from '../../modules/client-adm/factory/client-adm.facade.factory'

const clientsRouter = Router()
const clientFacade = ClientAdmFacadeFactory.create()

clientsRouter.post('/', async (req, res) => {
	try {
		const { id, name, email, address } = req.body

		if (!name || !email || !address) {
			return res.status(400).json({ error: 'Missing required fields' })
		}

		await clientFacade.add({
			id,
			name,
			email,
			address,
		})

		res.status(201).json({ message: 'Client created successfully' })
	} catch (error) {
		console.error('Error creating client:', error)
		res.status(500).json({ error: 'Failed to create client' })
	}
})

clientsRouter.get('/:id', async (req, res) => {
	try {
		const { id } = req.params

		if (!id) {
			return res.status(400).json({ error: 'Client ID is required' })
		}

		const client = await clientFacade.find({ id })

		res.status(200).json(client)
	} catch (error) {
		console.error('Error finding client:', error)
		res.status(500).json({ error: 'Failed to find client' })
	}
})

export default clientsRouter
