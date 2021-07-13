import BluebirdPromise from 'bluebird';
BluebirdPromise.config({
    cancellation: true
});
import * as env from './config/environment';
import * as server from './config/server';
import dbconnector from './config/database';
import logger from './config/logger';
import QueueManager from './services/queue/QueueManager';
import EventManager from './services/event/EventManager';
import MetricsCollectionService from './services/metrics/MetricsCollectionService';
import Shutdown from './utilities/Shutdown';
import RedisCacheManager from './services/cache/Redis';

env.config();

const {NODE_ENV, REDIS_URL} = process.env;

async function start(){
    try{
        logger.info('Connecting..');
        await dbconnector.authenticate();
        QueueManager.init(REDIS_URL as string, `saga_${NODE_ENV || 'development'}_bull`, true);
        EventManager.init();
        const metricsNamespace = `saga_${NODE_ENV || 'development'}`;
        await MetricsCollectionService.init(metricsNamespace);
        await server.start();
        logger.info('Connected');
    }catch(err){
        logger.info(err);
    }
}
void start();

Shutdown(async () => {
    await QueueManager.close();
    await dbconnector.close();
    await RedisCacheManager.close();
    await MetricsCollectionService.close();
})