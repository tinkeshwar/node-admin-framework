const entities = []
const now = new Date()

entities.push({ name: 'permissions.list', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'permissions.create', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'permissions.show', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'permissions.update', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'permissions.destroy', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'permissions.status', level: 'high', status: 1, created_at: now, updated_at: now })

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('permissions', entities)
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('permissions', {
      name: { [Sequelize.Op.in]: entities.map(entity => entity.name) }
    }, {})
  }
}
