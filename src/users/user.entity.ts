import { hash, compare } from 'bcryptjs';

export class User {
	private _password: string;
	constructor(private readonly _email: string, private readonly _name: string, password?: string) {
		if (password) {
			this._password = password;
		}
	}

	get password(): string {
		return this._password;
	}
	get email(): string {
		return this._email;
	}

	get name(): string {
		return this._name;
	}

	public async setPassword(pass: string, salt: number): Promise<void> {
		this._password = await hash(pass, salt);
	}

	public async validatePassword(pass: string): Promise<boolean> {
		return await compare(pass, this._password);
	}
}
