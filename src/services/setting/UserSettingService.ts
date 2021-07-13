import { UserSetting } from '../../models';
import { UserNotExistError } from '../error';

class UserSettingManager {

    static async getUserSettings(userId: number){
        if(!userId){
            throw new UserNotExistError();
        }
        const userSettings = await UserSetting.findAll({where:{
            user_id: userId,
            status: true
        }});
        return userSettings.map(setting =>{
            return {'key': setting.name, 'value': setting.value}
        });
    }
}

export default UserSettingManager;