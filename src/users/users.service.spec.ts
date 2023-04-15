import 'reflect-metadata';
import { Container } from 'inversify';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './interfaces/users.service.interface';
import { TYPES } from '../types';
import { UsersService } from './users.service';
import { IUsersRepository } from './repository/users.repository.interface';
import { User } from './user.entity';
import { UserModel } from '@prisma/client';
import { hash } from 'bcryptjs';

const ConfigServiceMock: IConfigService = {
	get: jest.fn(),
};

const UsersRepositoryMock: IUsersRepository = {
	find: jest.fn(),
	create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let usersRepository: IUsersRepository;
let usersService: IUserService;

const testUser: UserModel = {
	name: 'Illia',
	email: 'a@a.ua',
	password: '$2a$04$yCl0Bs7bmwQDGAXKQ34Dhu7uVhWA9kj1U821qWPCYEF1uE8AWLiNm', //hashed password with value '1' and slat '1'
	id: 1,
};

beforeAll(() => {
	container.bind<IUserService>(TYPES.UsersService).to(UsersService);
	container.bind<IConfigService>(TYPES.ConfigService).toConstantValue(ConfigServiceMock);
	container.bind<IUsersRepository>(TYPES.UsersRepository).toConstantValue(UsersRepositoryMock);

	configService = container.get<IConfigService>(TYPES.ConfigService);
	usersRepository = container.get<IUsersRepository>(TYPES.UsersRepository);
	usersService = container.get<IUserService>(TYPES.UsersService);
});

describe('User Service', () => {
	it('createUser', async () => {
		configService.get = jest.fn().mockReturnValueOnce('1');
		usersRepository.create = jest.fn().mockImplementationOnce(
			(user: User): UserModel => ({
				name: user.name,
				email: user.email,
				password: user.password,
				id: 1,
			}),
		);
		const createdUser = await usersService.createUser({
			email: 'a@a.ua',
			name: 'Illia',
			password: '1',
		});
		expect(createdUser?.id).toEqual(1);
		expect(createdUser?.password).not.toEqual('1');
	});

	it('validateUser - success', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(testUser);
		const res = await usersService.validateUser({
			email: 'a@a.ua',
			password: '1',
		});
		expect(res).toBeTruthy();
	});

	it('validateUser - wrong password', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(testUser);
		const res = await usersService.validateUser({
			email: 'a@a.ua',
			password: '2',
		});
		expect(res).toBeFalsy();
	});

	it('validateUser - wrong user', async () => {
		usersRepository.find = jest.fn().mockReturnValueOnce(null);
		const res = await usersService.validateUser({
			email: 'a@a.ua',
			password: '1',
		});
		expect(res).toBeFalsy();
	});
});
