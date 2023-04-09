import {BaseController} from "../common/base.controller";
import {LoggerService} from "../logger/logger.service";
import {NextFunction, Request, Response} from "express";
import {HTTPError} from "../errors/http-error.class";
import {ILogger} from "../logger/logger.interface";

export class UsersController extends BaseController {
    constructor(logger: ILogger) {
        super(logger);
        this.bindRoutes([
            {
                method:"post",
                path: "/login",
                func: this.login
            },
            {
                method: "post",
                path: "/register",
                func: this.register
            }
        ])
    }

    login(req: Request, res: Response, next: NextFunction) {
        // this.ok(res, "login");
        next(new HTTPError(401, 'Auth error', 'login'));
    }

    register(req: Request, res: Response, next: NextFunction) {
        this.ok(res, "register");
    }
}