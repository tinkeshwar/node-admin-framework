import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import { Model, Op } from 'sequelize';
import { Permission, Role, Image } from '../../models';
import User from '../../models/User';
import MasterController from '../master/MasterController';
import sequelize from '../../config/database';
import FileManager from '../../services/file/FileManager';
import { EventManager } from '../../services/event';

class UserController extends MasterController<typeof User>{

    constructor(){
        super(User)
    }

    async store(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const payload = await this.preStore(request);
            const {image}: {image?:{file: string, ext: string}} = request.payload as any;
            const users = await User.findAndCountAll({
                where:{
                    [Op.or]: [
                        { email: payload.email },
                        { phone: payload.phone }
                    ]
                }
            });
            if(users.count > 0){
                return Boom.badData('Email or phone number already exist.')
            }
            const user = await User.create(payload);
            if(image){
                const upload = await FileManager.movefile(image.file, image.ext, 'image');
                const imageResponse = await user.createImage({name:upload.name, path:upload.filepath,publicUrl:upload.public, imageableId:user.id, imageableType: 'user'});
                if(imageResponse){
                    EventManager.emit('IMAGE_UPLOADED',{
                        imageId: imageResponse.id
                    });
                }
            }
            return response.response((await user.reload()).toJSON());
        } catch (error) {
            return Boom.badData(error);
        }
    }

    async show(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const where = await this.preShow(request);
            const data = await this.model.findOne({
                where,
                include: [
                    {
                        model: Permission,
                        as: 'permissions',
                        required: false,
                        through: {
                            attributes: [] as string[]
                        }
                    },
                    {
                        model: Role,
                        as: 'roles',
                        required: false,
                        through: {
                            attributes: [] as string[]
                        }
                    },
                    {
                        model: Image,
                        as: 'image',
                        required: false
                    }
                ]
            });
            if(!data){
                return Boom.notFound('Record not found.');
            }
            return response.response(data.toJSON());
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }

    async update(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const { where, data } = await this.preUpdate(request);
            const {image}: {image?:{file: string, ext: string}} = request.payload as any;
            const users = await User.findAndCountAll({
                where:{
                    [Op.or]: [
                        { email: data.email },
                        { phone: data.phone }
                    ],
                    [Op.not]: [
                        {id: request.params.id}
                    ]
                }
            });
            if(users.count > 0){
                return Boom.badData('Email or phone number already exist.')
            }
            const updateable = await this.model.findOne({
                where
            });
            if(image){
                let existingImage = null;
                let imageId = null;
                const upload = await FileManager.movefile(image.file, image.ext, 'image');
                const imageExist = await updateable.getImage();
                if(imageExist){
                    existingImage = imageExist.name;
                    imageId = imageExist.id;
                    await imageExist.update({name:upload.name, path: upload.filepath,publicUrl:upload.public});
                }else{
                    const imageResponse = await updateable.createImage({name:upload.name, path:upload.filepath,publicUrl:upload.public, imageableId:updateable.id, imageableType: 'user'});
                    imageId = imageResponse.id;
                }
                if(imageId){
                    EventManager.emit('IMAGE_UPLOADED',{
                        imageId,
                        existingImage
                    });
                }
            }
            if(!updateable){
                return Boom.notFound('No record found.');
            }
            await updateable.update(data);
            return response.response((await updateable.reload()).toJSON());
        } catch (error) {
            return Boom.badData(error);
        }
    }

    async roles(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const user = await sequelize.transaction(async (t) => {
                const { where, data } = await this.preUpdate(request);
                const updateable = await this.model.findOne({ where });
                    if(!updateable){
                        return Boom.notFound('No user found.');
                    }
                if(data.roles.length === 0){
                    return Boom.notFound('No role found.');
                }
                const allRoles = (await Role.findAll()).map(role=>role.id);
                await updateable.removeRoles(allRoles,{transaction: t});
                for (const roleId of data.roles) {
                    const role = await Role.findByPk(roleId);
                    if(role){
                        await updateable.addRole(role, {transaction: t});
                    }
                }
                return (await updateable.reload()).toJSON();

            });
            return response.response(user);
        } catch (error) {
            return Boom.badData(error);
        }
    }

    async role(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const user = await sequelize.transaction(async (t) => {
                const { where, data } = await this.preUpdate(request);
                const updateable = await this.model.findOne({ where });
                    if(!updateable){
                        return Boom.notFound('No user found.');
                    }
                    const role = await Role.findByPk(data.role);
                    if(!role){
                        return Boom.notFound('No such role found.');
                    }
                    if(await updateable.hasRole(role)){
                        await updateable.removeRole(role, {transaction: t});
                    }else{
                        await updateable.addRole(role, {transaction: t});
                    }
                return (await updateable.reload()).toJSON();

            });
            return response.response(user);
        } catch (error) {
            return Boom.badData(error);
        }
    }

    async permissions(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const user = await sequelize.transaction(async (t) => {
                const { where, data } = await this.preUpdate(request);
                const updateable = await this.model.findOne({ where });
                if(!updateable){
                    return Boom.notFound('No user found.');
                }
                const allPermission = (await Permission.findAll()).map(permissions=>permissions.id);
                await updateable.removePermissions(allPermission,{transaction: t});
                if(data.permissions.length === 0){
                    return (await updateable.reload()).toJSON();
                }
                for (const permissionId of data.permissions) {
                    const permission = await Permission.findByPk(permissionId);
                    if(permission){
                        await updateable.addPermission(permission, {transaction: t});
                    }
                }
                return (await updateable.reload()).toJSON();

            });
            return response.response(user);
        } catch (error) {
            return Boom.badData(error);
        }
    }

    async permission(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const role = await sequelize.transaction(async (t) => {
                const { where, data } = await this.preUpdate(request);
                const updateable = await this.model.findOne({ where });
                if(!updateable){
                    return Boom.notFound('No user found.');
                }
                const permission = await Permission.findByPk(data.permission);
                if(!permission){
                    return Boom.notFound('No such permission found.');
                }
                if(await updateable.hasPermission(permission)){
                    await updateable.removePermission(permission, {transaction: t});
                }else{
                    await updateable.addPermission(permission, {transaction: t});
                }
                return (await updateable.reload()).toJSON();
            });
            return response.response(role);
        } catch (error) {
            return Boom.badData(error);
        }
    }
}

UserController.options = {
    id: 'id',
    searchBy: ['id', 'email', 'phone'],
    sortBy: ['created_at','desc'],
    createWith: ['id', 'firstname', 'lastname', 'middlename', 'phone', 'email', 'password'],
    updateWith: ['firstname', 'lastname', 'middlename', 'phone', 'email','roles','role', 'permissions','permission', 'status'],
    included: ['roles','image']
};

export default UserController;