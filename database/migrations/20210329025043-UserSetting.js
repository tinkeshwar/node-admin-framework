'use strict'

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const { DataTypes } = Sequelize
    await QueryInterface.createTable('user_settings', {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      userId: {
        allowNull: false,
        type: DataTypes.BIGINT,
        field: 'user_id',
        primaryKey: true,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      name: { type: DataTypes.STRING, allowNull: false },
      value: { type: DataTypes.STRING, allowNull: false },
      status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
      deletedAt: { type: DataTypes.DATE, allowNull: true, field: 'deleted_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' }
    })
  },

  down: async (QueryInterface) => {
    await QueryInterface.dropTable('user_settings')
  }
}
