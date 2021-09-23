import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import { AutoDate, Column, Entity, Nullable, PrimaryKey, Unique } from '../utilities/SequelizeDecorator'

@Entity('permissions', { sequelize, paranoid: true })
class Permission extends Model {
    @PrimaryKey()
    public id!: number;

    @Unique
    @Column(DataTypes.STRING)
    public name?: string;

    @Column(DataTypes.STRING)
    public level?: string;

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

    public toJSON (): Record<string, any> {
      const permission = this.get('', { plain: true }) as Record<string, any>
      if (!permission.deletedAt) {
        delete permission.deletedAt
      }
      return permission
    }
}

export default Permission
