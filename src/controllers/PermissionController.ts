import Permission from '../models/Permission';
import MasterController from './MasterController';

class PermissionController extends MasterController<typeof Permission> {

    constructor(){
        super(Permission);
    }
}

export default PermissionController;