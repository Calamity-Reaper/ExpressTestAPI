"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const express_1 = __importDefault(require("express"));
class App {
    constructor(logger, usersController, exceptionFilter) {
        this.app = (0, express_1.default)();
        this.port = 8000;
        this.logger = logger;
        this.usersController = usersController;
        this.exceptionFilter = exceptionFilter;
    }
    useRoutes() {
        this.app.use('/users', this.usersController.router);
    }
    useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.useRoutes();
            this.useExceptionFilters();
            this.server = this.app.listen(this.port);
            this.logger.log(`Server started on http://localhost:${this.port}`);
        });
    }
}
exports.App = App;
