import Permission from '../../models/Permission';
import MasterController from '../master/MasterController';

class PermissionController extends MasterController<typeof Permission> {

    constructor(){
        super(Permission);
    }
}

PermissionController.options = {
    id: 'id',
    searchBy: ['id'],
    sortBy: ['created_at','desc'],
    createWith: ['id', 'name', 'level'],
    updateWith: ['name', 'level', 'status'],
    included: []
};

export default PermissionController;