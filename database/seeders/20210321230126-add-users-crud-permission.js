const entities = []
const now = new Date()

entities.push({ name: 'users.list', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'users.create', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'users.show', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'users.update', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'users.destroy', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'users.status', level: 'high', status: 1, created_at: now, updated_at: now })

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
