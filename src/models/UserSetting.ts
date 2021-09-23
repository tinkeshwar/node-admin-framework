import { DataTypes, Model } from 'sequelize'
import sequelize from '../config/database'
import { AutoDate, Column, Entity, ForeignKey, Nullable, PrimaryKey, Unique } from '../utilities/SequelizeDecorator'

@Entity('user_settings', { sequelize, paranoid: true })
class UserSetting extends Model {
    @PrimaryKey()
    public id!: number;

    @ForeignKey()
    public userId!: number;

    @Column(DataTypes.STRING)
    public name!: string;

    @Unique
    @Column(DataTypes.STRING)
    public value!: string;

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
      const userSetting = this.get('', { plain: true }) as Record<string, any>
      if (!userSetting.deletedAt) {
        delete userSetting.deletedAt
      }
      return userSetting
    }
}

export default UserSetting
