import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { Op } from 'sequelize';
import { User } from '../models';
import MasterController from './MasterController';


class UserController extends MasterController<typeof User>{

    constructor(){
        super(User)
    }

    async store(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const payload = await this.preStore(request);
            const user = await User.findAndCountAll({where:{
                [Op.or]: [
                    { email: payload.email },
                    { phone: payload.phone }
                  ]
            }});
            if(user.count > 0){
                return Boom.badData('Email or phone number exist.')
            }
            const data = await this.model.create(payload);
            return response.response((await data.reload()).toJSON());
        } catch (error) {
            return Boom.badData(error);
        }
    }
}
export default UserController;