import {
	Column,
	DataType,
	Model,
	PrimaryKey,
	Table,
} from 'sequelize-typescript'

@Table({
	tableName: 'orders',
	timestamps: false,
})
export class OrderModel extends Model {
	@PrimaryKey
	@Column({ allowNull: false })
	id: string

	@Column({ allowNull: false })
	clientId: string

	@Column({ allowNull: false })
	clientName: string

	@Column({ allowNull: false })
	clientEmail: string

	@Column({ allowNull: false, type: DataType.JSON })
	clientAddress: {
		street: string
		number: string
		complement: string
		city: string
		state: string
		zipCode: string
	}

	@Column({ allowNull: false, type: DataType.JSON })
	products: {
		id: string
		name: string
		description: string
		salesPrice: number
	}[]

	@Column({ allowNull: false })
	status: string

	@Column({ allowNull: false })
	createdAt: Date

	@Column({ allowNull: false })
	updatedAt: Date
}
