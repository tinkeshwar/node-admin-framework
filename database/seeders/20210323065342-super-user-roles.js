'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('role_user', [{
      user_id: 1,
      role_id: 1,
      created_at: '2021-03-21 19:53:50',
      updated_at: '2021-03-21 19:53:50'
    }])
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('role_user', null, {})
  }
}
