import Role from '../models/Role';
import MasterController from './MasterController';

class RoleController extends MasterController<typeof Role> {

    constructor(){
        super(Role);
    }
}

export default RoleController;