import {
	Model,
	Table,
	Column,
	PrimaryKey,
	ForeignKey,
	BelongsTo,
} from 'sequelize-typescript'
import { InvoiceModel } from './invoice.model'

@Table({
	tableName: 'invoice_items',
	timestamps: false,
})
export default class InvoiceItemModel extends Model {
	@PrimaryKey
	@Column({ allowNull: false })
	id: string

	@Column({ allowNull: false })
	name: string

	@Column({ allowNull: false })
	price: number

	@ForeignKey(() => InvoiceModel)
	@Column({ allowNull: false, field: 'invoice_id' })
	invoiceId: string

	@BelongsTo(() => InvoiceModel)
	invoice: InvoiceModel
}
