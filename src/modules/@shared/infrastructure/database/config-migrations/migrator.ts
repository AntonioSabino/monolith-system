import { SequelizeStorage, Umzug } from 'umzug'
import { join } from 'path'
import { Sequelize } from 'sequelize'

export const migrator = (sequelize: Sequelize) => {
	return new Umzug({
		migrations: {
			glob: [
				'*/database/migrations/*.ts',
				{
					cwd: join(__dirname, '../../../'),
					ignore: [
						'**/node_modules/**',
						'**/*.d.ts',
						'**/*.d.ts',
						'**/index.ts',
						'**/index.js',
					],
				},
			],
		},
		storage: new SequelizeStorage({ sequelize }),
		context: sequelize,
		logger: console,
	})
}
