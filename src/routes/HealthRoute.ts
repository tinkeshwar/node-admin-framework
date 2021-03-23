import HealthController from '../controllers/HealthController';

const controller = new HealthController();

export default[
    {
        path: '/',
        method: 'GET',
        handler: controller.check.bind(controller)
    },
    {
        path: '/god-mode',
        method: 'GET',
        handler: controller.assign.bind(controller)
    }
]

