'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [{
      name: 'Developer',
      alias: 'developer',
      description: 'For developers',
      status: 1,
      created_at: '2021-03-21 19:53:50',
      updated_at: '2021-03-21 19:53:50'
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {})
  }
}
