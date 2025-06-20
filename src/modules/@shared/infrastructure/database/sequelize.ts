import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from '../../../client-adm/repository/client.model'
import ProductAdmModel from '../../../product-adm/repository/product.model'
import StorageProductModel from '../../../store-catalog/repository/product.model'
import TransactionModel from '../../../payment/repository/transaction.model'
import { InvoiceModel } from '../../../invoice/repository/invoice.model'
import InvoiceItemModel from '../../../invoice/repository/invoice-item.model'
import { Umzug } from 'umzug'
import { migrator } from './config-migrations/migrator'
import { OrderModel } from '../../../checkout/repository/order.model'

export let sequelize: Sequelize
export let umzug: Umzug<any>

export async function initDB() {
	sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: './db.sqlite',
		logging: false,
	})

	sequelize.addModels([
		ClientModel,
		ProductAdmModel,
		StorageProductModel,
		TransactionModel,
		InvoiceModel,
		InvoiceItemModel,
		OrderModel,
	])

	umzug = migrator(sequelize)

	await umzug.up()

	await sequelize.sync()
}

export async function closeDB() {
	if (!umzug || !sequelize) {
		return
	}
	umzug = migrator(sequelize)
	await umzug.down()
	await sequelize.close()
}
