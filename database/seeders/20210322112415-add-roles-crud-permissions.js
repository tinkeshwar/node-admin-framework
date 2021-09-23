const entities = []
const now = new Date()

entities.push({ name: 'roles.list', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'roles.create', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'roles.show', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'roles.update', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'roles.destroy', level: 'high', status: 1, created_at: now, updated_at: now })
entities.push({ name: 'roles.status', level: 'high', status: 1, created_at: now, updated_at: now })

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
