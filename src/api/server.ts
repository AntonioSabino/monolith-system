import app from './express'
import { initDB } from '../modules/@shared/infrastructure/database/sequelize'

const port = process.env.PORT || 3000

async function startServer() {
	try {
		await initDB()
		console.log('Database initialized successfully')

		app.listen(port, () => {
			console.log(`Server is running on port ${port}`)
		})
	} catch (error) {
		console.error('Failed to start server:', error)
		process.exit(1)
	}
}

startServer()
