import {BaseController} from "../common/base.controller";
import {NextFunction, Request, Response} from "express";
import {HTTPError} from "../errors/http-error.class";
import {ILogger} from "../logger/logger.interface";
import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import 'reflect-metadata'

@injectable()
export class UsersController extends BaseController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);
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