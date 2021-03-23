// tslint:disable-next-line: no-var-requires
global.Promise = require('bluebird');

import * as server from './config/server';
import dbconnector from './config/database';
import logger from './config/logger';

async function start(){
    try{
        await dbconnector.authenticate();
        await server.start();
    }catch(err){
        logger.info(err);
    }
}
start();