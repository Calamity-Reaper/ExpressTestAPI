import { App } from './app';
import { LoggerService } from './logger/logger.service';
import { UsersController } from './users/users.controller';
import { ExceptionFilter } from './errors/exception.filter';
import { ILogger } from './logger/logger.interface';
import { Container, ContainerModule, interfaces } from 'inversify';
import { TYPES } from './types';
import { IExceptionFilter } from './errors/exception.filter.interface';
import { IUsersController } from './users/interfaces/users.controller.interface';
import { IUserService } from './users/interfaces/users.service.interface';
import { UsersService } from './users/users.service';
import { IConfigService } from './config/config.service.interface';
import { ConfigService } from './config/config.service';

export interface IBootstrapReturn {
	app: App;
	appContainer: Container;
}

export const appBindings = new ContainerModule((bind: interfaces.Bind) => {
	bind<ILogger>(TYPES.ILogger).to(LoggerService).inSingletonScope();
	bind<IExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilter).inSingletonScope();
	bind<IUsersController>(TYPES.UsersController).to(UsersController).inSingletonScope();
	bind<IUserService>(TYPES.UsersService).to(UsersService).inSingletonScope();
	bind<IConfigService>(TYPES.ConfigService).to(ConfigService).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

function bootstrap(): IBootstrapReturn {
	const appContainer = new Container();
	appContainer.load(appBindings);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();

	return { app, appContainer };
}

export const { app, appContainer } = bootstrap();
