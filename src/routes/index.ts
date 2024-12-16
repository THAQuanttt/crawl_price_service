import { Express } from "express";

import loggerMiddleware from "../lib/middlewares/logger.middleware";
import authorizationMiddleware from "../lib/middlewares/authorization.middleware";
import notFoundMiddleware from "../lib/middlewares/not-found.middleware";
import filterExceptionMiddleware from "../lib/middlewares/filter-exception.middleware";

import auth from './auth.r';
import users from './users.r';

const initRoutes = async (app: Express) => {
    app.use(loggerMiddleware);
    app.use(authorizationMiddleware);
    app.use('/auth', auth);
    app.use('/users', users);
    app.use('*', notFoundMiddleware);
    app.use(filterExceptionMiddleware);
}

export default initRoutes;