import Hapi from '@hapi/hapi';
import documentor from './documentor';
import routes from './route';
import logger from './logger';
import * as env from './environment';
import AuthService from '../services/auth/AuthService';
import Joi from 'joi';
import Redis from 'ioredis';
import Boom from '@hapi/boom';
// initialize configuration
env.config();
const {SERVER_PORT,SERVER_HOST,JWT_TOKEN} = process.env;

export const server = new Hapi.Server({
    host:SERVER_HOST,
    port:SERVER_PORT,
    routes: {
        cors: {
            origin: ['*'],
            credentials: true,
            headers: ['Accept', 'Content-Type','Authorization'],
            additionalHeaders: ['X-localization']
        },
        validate: {
            failAction: async (request, h, err) => {
              if (process.env.NODE_ENV === 'production') {
                throw Boom.badRequest(err.message);
              } else {
                throw Boom.badRequest(err.message);
              }
            }
        }
    }
});

let prepared = false;
const redis = new Redis();

async function prepare(){
    if(prepared){
        return;
    }
    await server.register(documentor as any);
    server.auth.strategy('token','jwt',{
        key:JWT_TOKEN,
        validate: AuthService.verify,
        verifyOptions:{
            algorithms:['HS256']
        },
    });
    server.validator(Joi);
    server.route(routes);
    prepared = true;
}
export async function start() {
    await prepare();
    await server.start();
    logger.info(`Redis is ${redis.status}`);
    logger.info(`Server started on port: ${SERVER_PORT}`);
    logger.info(`Explorer is available at: ${SERVER_HOST}:${SERVER_PORT}/explorer`);
    return server;
}

export async function init() {
    await prepare();
    await server.initialize();
    return server;
}

export async function stop() {
    await server.stop();
}