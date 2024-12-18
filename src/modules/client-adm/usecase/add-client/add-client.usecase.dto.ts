export interface addClientInputDto {
	id?: string
	name: string
	email: string
	address: string
}

export interface addClientOutputDto {
	id: string
	name: string
	email: string
	address: string
	createdAt: Date
	updatedAt: Date
}
