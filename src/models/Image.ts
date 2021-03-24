import {DataTypes, Model} from 'sequelize';
import sequelize from '../config/database';
import {AutoDate, Column, Entity, Nullable, PrimaryKey} from '../utilities/SequelizeDecorator';

@Entity('images', { sequelize })
class Image extends Model {

    @PrimaryKey()
    public id!: number;

    @Column(DataTypes.STRING)
    public name?: string;

    @Column(DataTypes.STRING)
    public path?: string;

    @Column(DataTypes.INTEGER)
    public imageableId?: number;

    @Column(DataTypes.STRING)
    public imageableType?: string;

    @Nullable
    @Column(DataTypes.BOOLEAN)
    public status?: boolean;

    @AutoDate()
    public readonly createdAt!: Date;

    @AutoDate()
    public readonly updatedAt!: Date;

    @Nullable
    @Column(DataTypes.DATE)
    public readonly deletedAt?: Date;

    public toJSON(): Record<string, any> {
        const image = this.get('', { plain: true }) as Record<string, any>;
        if(!image.deletedAt){
            delete image.deletedAt;
        }
        return image;
    }
}

export default Image;
