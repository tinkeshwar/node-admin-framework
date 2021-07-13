import * as Hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import CPUService from '../../services/performance/CPUService';
import { Permission, Role, User } from '../../models';
import EventManager from '../../services/event/EventManager';

class HealthController {

    async check(request: Hapi.Request, response: Hapi.ResponseToolkit){
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        }
        return response.response(healthcheck);
    }

    async cpu(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const healthcheck = {
                uptime: process.uptime(),
                timestamp: Date.now(),
                cpu: await CPUService.cpuAverage(),
                usage: await CPUService.cpuProcess()
            }
            return response.response(healthcheck);
        } catch (error) {
            Boom.internal('Something not right here.');
        }
    }

    async assign(request: Hapi.Request, response: Hapi.ResponseToolkit){
        const permissions = await Permission.findAll();
        const role = await Role.findByPk(1);
        const user = await User.findByPk(1);

        permissions.forEach(permission => {
            role.addPermission(permission);
        });
        user.addRole(role);
        return response.response('God Mode Granted.');
    }
}
export default HealthController;