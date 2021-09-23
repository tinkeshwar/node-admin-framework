'use strict'

module.exports = {
  up: async (QueryInterface, Sequelize) => {
    const { DataTypes } = Sequelize
    await QueryInterface.createTable('permissions', {
      id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, unique: true, allowNull: false },
      level: { type: DataTypes.STRING, allowNull: true },
      status: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: 0 },
      deletedAt: { type: DataTypes.DATE, allowNull: true, field: 'deleted_at' },
      createdAt: { type: DataTypes.DATE, allowNull: false, field: 'created_at' },
      updatedAt: { type: DataTypes.DATE, allowNull: false, field: 'updated_at' }
    })
  },

  down: async (QueryInterface) => {
    await QueryInterface.dropTable('permissions')
  }
}
