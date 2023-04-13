import { IUserService } from './interfaces/users.service.interface';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { User } from './user.entity';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IConfigService } from '../config/config.service.interface';
import { IUsersRepository } from './repository/users.repository.interface';
import { UserModel } from '@prisma/client';

@injectable()
export class UsersService implements IUserService {
	constructor(
		@inject(TYPES.ConfigService) private configService: IConfigService,
		@inject(TYPES.UsersRepository) private usersRepository: IUsersRepository,
	) {}
	async createUser({ email, password, name }: UserRegisterDto): Promise<UserModel | null> {
		const newUser = new User(email, name);
		const salt = this.configService.get('SALT');
		await newUser.setPassword(password, Number(salt));
		const existedUser = await this.usersRepository.find(email);
		if (existedUser) {
			return null;
		}
		return this.usersRepository.create(newUser);
	}

	async getUser(email: string): Promise<UserModel | null> {
		const user = await this.usersRepository.find(email);
		if (!user) {
			return null;
		} else {
			return user;
		}
	}

	async validateUser({ email, password }: UserLoginDto): Promise<UserModel | null> {
		const user = await this.usersRepository.find(email);
		if (!user) {
			return null;
		}
		const newUser = new User(user.email, user.name, user.password);
		if (await newUser.validatePassword(password)) {
			return user;
		}
		return null;
	}
}
