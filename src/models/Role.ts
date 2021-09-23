import { Association, BelongsToManyAddAssociationMixin, BelongsToManyCountAssociationsMixin, BelongsToManyCreateAssociationMixin, BelongsToManyGetAssociationsMixin, BelongsToManyHasAssociationMixin, BelongsToManyRemoveAssociationMixin, BelongsToManyRemoveAssociationsMixin, DataTypes, HasOneCreateAssociationMixin, Model } from 'sequelize'
import { Permission } from '.'
import sequelize from '../config/database'
import { AutoDate, Column, Entity, Nullable, PrimaryKey } from '../utilities/SequelizeDecorator'
import RoleSidebar from './RoleSidebar'

@Entity('roles', { sequelize, paranoid: true })
class Role extends Model {
  public get scopes (): string[] {
    if (!this.permissions) {
      return []
    }
    return (this.permissions).map((permission:any) => (permission.name !== undefined) ? permission.name : '')
  }

    public static associations: {
        permissions: Association<Role, Permission>;
    };

    @PrimaryKey()
    public id!: number;

    @Column(DataTypes.STRING)
    public name?: string;

    @Column(DataTypes.STRING)
    public alias?: string;

    @Column(DataTypes.TEXT)
    public description?: string;

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

    public getPermissions!: BelongsToManyGetAssociationsMixin<Permission>;
    public setPermission!: BelongsToManyAddAssociationMixin<Permission, number>;
    public addPermission!: BelongsToManyAddAssociationMixin<Permission, number>;
    public hasPermission!: BelongsToManyHasAssociationMixin<Permission, number>;
    public countPermissions!: BelongsToManyCountAssociationsMixin;
    public createPermission!: BelongsToManyCreateAssociationMixin<Permission>;
    public removePermission!: BelongsToManyRemoveAssociationMixin<Permission, number>;
    public removePermissions!: BelongsToManyRemoveAssociationsMixin<Permission, number>;

    public createRoleSidebar!: HasOneCreateAssociationMixin<RoleSidebar>;

    public readonly permissions?: Permission[];

    public toJSON (): Record<string, any> {
      const role = this.get('', { plain: true }) as Record<string, any>
      if (!role.deletedAt) {
        delete role.deletedAt
      }
      return role
    }
}

Role.belongsToMany(Permission, {
  as: 'permissions',
  through: 'permission_role',
  foreignKey: 'role_id',
  otherKey: 'permission_id'
})

Role.hasOne(RoleSidebar, { as: 'roleSidebar', foreignKey: 'role_id' })
RoleSidebar.belongsTo(Role, { as: 'role' })

export default Role
