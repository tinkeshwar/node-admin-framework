import { Permission, Role, User } from "../../models";

class PermissionService{

    static async getUserRoles(userId: number): Promise<string[]>{
        const scope: User = await User.findByPk(userId, {
            include:[
                {model: Permission, as: 'permissions', where:{status: 1}, required: false},
                {model: Role, as: 'roles', where:{status: 1},required:false, include: [{ model: Permission, as: 'permissions' }]}
            ]
        });
        return scope ? scope.scopes: [];
    }
}

export default PermissionService;