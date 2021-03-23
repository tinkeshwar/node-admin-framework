import Boom from '@hapi/boom';
import Hapi from '@hapi/hapi';
import camelCaseKeys from 'camelcase-keys';
import {FindAndCountOptions, Model, OrderItem} from 'sequelize';

type ModelStatic = typeof Model & (new () => Model);
abstract class MasterController<T extends ModelStatic>  {
    protected model: T;

    constructor(model: T) {
        this.model = model;
    }

    async preList(request: Hapi.Request): Promise<FindAndCountOptions> {
        const { page, records }: { page: number; records: number; } = request.query as any;
        return {
          offset: records * (page - 1),
          limit: records,
          order: [['createdAt', 'DESC']] as OrderItem[],
          paranoid: Boolean(request.query.all)
        };
    }

    async list(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const {page, records} = request.query;
            const query = await this.preList(request);
            const items = await this.model.findAndCountAll(query);
            const data = {
                list: items.rows.map((record: Model) => record.toJSON()),
                meta: { 
                    total: items.count,
                    page: page,
                    per_page: records
                }
            }
            return response.response(data);
        } catch (error) {
            Boom.internal('Something went wrong.')
        }
    }

    async preStore(request: Hapi.Request): Promise<Record<string, any>> {
        const payload = request.payload;
        return camelCaseKeys(payload as Record<string, any>) as Record<string, any>;
    }

    async store(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const payload = await this.preStore(request);
            const data = await this.model.create(payload);
            return response.response((await data.reload()).toJSON());
        } catch (error) {
            return Boom.badData(error);
        }
    }

    async show(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const {id} = request.params;
            const data = await this.model.findByPk(id);
            if(!data){
                return Boom.notFound('Record not found.');
            }
            return response.response(data);
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }

    async update(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const {id} = request.params;
            const payload = await this.preStore(request);
            const updateable = await this.model.findByPk(id);
            if(!updateable){
                return Boom.notFound('No record found.');
            }
            await updateable.update(payload);
            return response.response((await updateable.reload()).toJSON());
        } catch (error) {
            return Boom.badData(error);
        }
    }

    async destroy(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const {id} = request.params;
            const data = await this.model.findByPk(id);
            if(!data){
                return Boom.notFound('Record not found.');
            }
            data.destroy();
            return response.response(data);
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }

    async status(request: Hapi.Request, response: Hapi.ResponseToolkit): Promise<Error | Hapi.ResponseObject>{
        try {
            const {id} = request.params;
            const data: any = await this.model.findByPk(id);
            if(!data){
                return Boom.notFound('Record not found.');
            }
            if(data.status){
                data.set({status: 0});
            }else{
                data.set({status: 1});
            }
            const result = await data.save();
            if(!result){
                return Boom.serverUnavailable('Unknown error.')
            }
            return response.response({
                success: 'Success',
                status: result.status
            });
        } catch (error) {
            return Boom.badImplementation(error);
        }
    }
}
export default MasterController;