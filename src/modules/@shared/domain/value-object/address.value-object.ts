import ValueObject from './value-object.interface'

// address: {
// 	street: string
// 	number: string
// 	complement: string
// 	city: string
// 	state: string
// 	zipCode: string
// }

type AddressValueObjectProps = {
	street: string
	number: string
	complement: string
	city: string
	state: string
	zipCode: string
}

export default class Address implements ValueObject {
	private _street: string
	private _number: string
	private _complement: string
	private _city: string
	private _state: string
	private _zipCode: string

	constructor(props: AddressValueObjectProps) {
		this._street = props.street
		this._number = props.number
		this._complement = props.complement
		this._city = props.city
		this._state = props.state
		this._zipCode = props.zipCode
	}

	get street(): string {
		return this._street
	}

	get number(): string {
		return this._number
	}

	get complement(): string {
		return this._complement
	}

	get city(): string {
		return this._city
	}

	get state(): string {
		return this._state
	}

	get zipCode(): string {
		return this._zipCode
	}

	get value(): AddressValueObjectProps {
		return {
			street: this._street,
			number: this._number,
			complement: this._complement,
			city: this._city,
			state: this._state,
			zipCode: this._zipCode,
		}
	}
}
