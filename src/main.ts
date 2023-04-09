import {App} from "./app";
import {LoggerService} from "./logger/logger.service";
import {UsersController} from "./users/users.controller";
import {ExceptionFilter} from "./errors/exception.filter";
import {ILogger} from "./logger/logger.interface";

async function bootstrap() {
    const logger: ILogger = new LoggerService();
    const app = new App(
        logger,
        new UsersController(logger),
        new ExceptionFilter(logger)
    );
    await app.init();
}

bootstrap();