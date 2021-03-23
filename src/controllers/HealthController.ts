import Hapi from '@hapi/hapi';
import { Permission, User } from '../models';


class HealthController {

    async check(request: Hapi.Request, response: Hapi.ResponseToolkit){
        const healthcheck = {
            uptime: process.uptime(),
            message: 'OK',
            timestamp: Date.now()
        }
        return response.response(healthcheck);
    }

    async assign(request: Hapi.Request, response: Hapi.ResponseToolkit){
        const permissions = await Permission.findAll();
        const user = await User.findByPk(1);

        permissions.forEach(permission => {
            user.addPermission(permission);
        });
        return response.response('God Mode Granted.');
    }
}
export default HealthController;