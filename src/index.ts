import BluebirdPromise from 'bluebird'
import * as env from './config/environment'
import * as server from './config/server'
import dbconnector from './config/database'
import logger from './config/logger'
import QueueManager from './services/queue/QueueManager'
import EventManager from './services/event/EventManager'
import MetricsCollectionService from './services/metrics/MetricsCollectionService'
import Shutdown from './utilities/Shutdown'
import RedisCacheManager from './services/cache/Redis'
BluebirdPromise.config({
  cancellation: true
})

env.config()

const { NODE_ENV, REDIS_URL } = process.env

const start = async () => {
  try {
    logger.info('Connecting..')
    await dbconnector.authenticate()
    QueueManager.init(REDIS_URL as string, `saga_${NODE_ENV || 'development'}_bull`, true)
    EventManager.init()
    await MetricsCollectionService.init(`saga_${NODE_ENV || 'development'}`)
    await server.start()
    logger.info('Connected')
  } catch (error: any) {
    logger.error(error)
  }
}
start()

Shutdown(async () => {
  await server.stop()
  await QueueManager.close()
  await dbconnector.close()
  await RedisCacheManager.close()
  await MetricsCollectionService.close()
})
