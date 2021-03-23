import { Permission, Role, User } from "../../models";

class PermissionService{
    
    static async getUserRoles(userId: number): Promise<string[]>{
        const scope: User = await User.findByPk(userId, {
            include:[
                {model: Role, as: 'roles', where:{status: 1}, include: [{ model: Permission, as: 'permissions' }]},
                {model: Permission, as: 'permissions', where:{status: 1}}
            ]
        });
        
        return scope ? scope.scopes: [];
    }
}

export default PermissionService;