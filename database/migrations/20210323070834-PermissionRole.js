'use strict';

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const {DataTypes} = Sequelize;
      await QueryInterface.createTable('permission_role',{
          userId: {
              allowNull: false,
              type: DataTypes.INTEGER,
              field: 'permission_id',
              primaryKey: true,
              references: {
                  model: {
                      tableName: 'permissions'
                  },
                  key: 'id'
              },
              onUpdate: 'cascade',
              onDelete: 'cascade'
          },
          roleId: {
              allowNull: false,
              type: DataTypes.INTEGER,
              field: 'role_id',
              primaryKey: true,
              references: {
                  model: {
                      tableName: 'roles'
                  },
                  key: 'id'
              },
              onUpdate: 'cascade',
              onDelete: 'cascade'
          },
          createdAt: {type: DataTypes.DATE, allowNull: false, field:'created_at'},
          updatedAt: {type: DataTypes.DATE, allowNull: false, field:'updated_at'},
      });
  },

  down: async (QueryInterface, Sequelize) => {
    await QueryInterface.dropTable('permission_role');
  }
};