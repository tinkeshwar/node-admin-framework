'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      email: 'tinkeshwar@admin.com',
      phone: '9876543210',
      password: '$2b$10$9kJptxqva8Yd6PWY9dTCYu9jTU6.sCbJ5XBYTzI0s.7HpSDtuD5tC', // admin
      firstname: 'Tinkeshwar',
      lastname: 'Singh',
      email_verified_at: '2021-03-21 19:53:50',
      phone_verified_at: '2021-03-21 19:53:50',
      status: true,
      created_at: '2021-03-21 19:53:50',
      updated_at: '2021-03-21 19:53:50'
    }], {})
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
}
