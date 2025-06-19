import { Router } from 'express'
import productsRouter from './products.routes'
import clientsRouter from './clients.routes'
import checkoutRouter from './checkout.routes'
import invoiceRouter from './invoice.routes'

const router = Router()

router.use('/products', productsRouter)
router.use('/clients', clientsRouter)
router.use('/checkout', checkoutRouter)
router.use('/invoice', invoiceRouter)

export default router
