import { Sequelize } from 'sequelize-typescript'
import { ClientModel } from '../../../client-adm/repository/client.model'
import ProductAdmModel from '../../../product-adm/repository/product.model'
import StorageProductModel from '../../../store-catalog/repository/product.model'
import TransactionModel from '../../../payment/repository/transaction.model'
import { InvoiceModel } from '../../../invoice/repository/invoice.model'
import InvoiceItemModel from '../../../invoice/repository/invoice-item.model'
import { Umzug } from 'umzug'
import { migrator } from './config-migrations/migrator'

export let sequelize: Sequelize
let migration: Umzug<any>

export async function initDB() {
	sequelize = new Sequelize({
		dialect: 'sqlite',
		storage: ':memory:',
		logging: false,
	})

	sequelize.addModels([
		ClientModel,
		ProductAdmModel,
		StorageProductModel,
		TransactionModel,
		InvoiceModel,
		InvoiceItemModel,
	])

	migration = migrator(sequelize)
	await migration.up()
	await sequelize.sync()
}

export async function closeDB() {
	if (!migration || !sequelize) {
		return
	}
	migration = migrator(sequelize)
	await migration.down()
	await sequelize.close()
}
