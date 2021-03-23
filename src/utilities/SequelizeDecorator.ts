
import 'reflect-metadata';
import {DataType, DataTypes,InitOptions,Model} from 'sequelize';
import snakeCaseKeys from 'snakecase-keys';
import toSnakeCase from 'to-snake-case';



interface IColumnOption {[key: string]: any; type?: never;}

interface IEntityOptions extends InitOptions{
    tableName?: never;
    eventModelId?: string;
    eventId?: string;
    eventPrefix?: string;
}

type ModelStatic = typeof Model & (new ()=>Model);

const attributesMetadataField = Symbol('sequelizeAttributes');

const defaultEntityOptions = {
    paranoid: false,
    underscored: true
}

export function Column(type: DataType, options: IColumnOption = {}){
    return (target: any, propertyKey: string) =>{
        const attributes = Reflect.getMetadata(attributesMetadataField, target) || {};
        Reflect.defineMetadata(attributesMetadataField, {
            ...attributes,
            [propertyKey]:{type, allowNull: false, ...options}
        }, target);
    };
}

export function  PrimaryKey(options:IColumnOption = {}) {
    return Column(
        DataTypes.INTEGER,
        {autoIncrement: true, primaryKey: true, ...options}
    );
}

export function AutoDate(options: IColumnOption = {}) {
    return Column(
        DataTypes.DATE, 
        {allowNull: true, ...options}
    );
}



export function Extend(options: IColumnOption = {}) {
    return (target: any, propertyKey: string)=>{
        const attributes = Reflect.getMetadata(attributesMetadataField, target) || {};
        const attribute = attributes[propertyKey];
        if(!attribute){
            throw new Error(`${propertyKey} is not a Column`);
        }
        attributes[propertyKey] = Object.assign(attribute, options);
        Reflect.defineMetadata(attributesMetadataField, attributes, target);
    };
}

export function Nullable(target: any, propertyKey: string) {
    Extend({allowNull: true})(target, propertyKey);
}

export function Unique(target: any, propertyKey: string) {
    Extend({unique: true})(target, propertyKey);
}


export function  Entity(tableName: string, options: IEntityOptions) {
    return (target: ModelStatic)=>{
        const attribute = Reflect.getMetadata(attributesMetadataField, target.prototype);
        if(!attribute){
            throw new Error(`Columns must be defined in the model before declaring it as an Entity`);
        }
        const initOptions = Object.assign({}, defaultEntityOptions, options);
        delete initOptions.eventPrefix;
        delete initOptions.eventModelId;
        delete initOptions.eventId;

        if(initOptions.underscored){
            const toJSON = target.prototype.toJSON || function(this: any){
                return this.get('',{plain:true});
            };
            target.prototype.toJSON = function(){
                return snakeCaseKeys(toJSON.apply(this));
            };
        }

        target.init(attribute, {
            tableName,
            ...initOptions
        });

        /*if(options.eventPrefix && options.eventId){
            target.afterCreate(async (record) => {

            });
            target.afterUpdate(async (record) => {

            });
            target.afterDestroy(async (record) => {

            });
        }*/
    }
}