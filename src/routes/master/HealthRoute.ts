import HealthController from '../../controllers/master/HealthController';

const controller = new HealthController();

export default[
    {
        path: '/',
        method: 'GET',
        handler: controller.check.bind(controller)
    },
    {
        path: '/api/server-state',
        method: 'GET',
        handler: controller.cpu.bind(controller),
        config: {
            auth: {
                strategy: 'token',
            },
            validate: {
                options: {abortEarly: false},
            }
        }
    },
    {
        path: '/god-mode',
        method: 'GET',
        handler: controller.assign.bind(controller)
    }
]

