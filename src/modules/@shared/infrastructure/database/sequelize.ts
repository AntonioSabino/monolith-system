import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from '../../../client-adm/repository/client.model'
import { ProductModel } from '../../../product-adm/repository/product.model'
import TransactionModel from '../../../payment/repository/transaction.model'
import { InvoiceModel } from '../../../invoice/repository/invoice.model'
import InvoiceItemModel from '../../../invoice/repository/invoice-item.model'

export let sequelize: Sequelize

export async function initDB() {
	sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: ':memory:',
		logging: false,
	})

	sequelize.addModels([
		ClientModel,
		ProductModel,
		TransactionModel,
		InvoiceModel,
		InvoiceItemModel,
	])

	await sequelize.sync({ force: true })
}

export async function closeDB() {
	if (sequelize) {
		await sequelize.close()
	}
}
