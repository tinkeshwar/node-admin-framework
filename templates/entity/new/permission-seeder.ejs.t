---
to: database/seeders/<%= h.timestamp() %>-add-<%= h.inflection.dasherize(h.inflection.underscore(h.inflection.pluralize(name))) %>-crud-permissions.js
---
const entities = [];
const now = new Date();

entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.list', status: 1, level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.create', status: 1, level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.show', status: 1, level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.update', status: 1, level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.destroy', status: 1, level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.status', status: 1, level:'low', created_at: now, updated_at: now });

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('permissions', entities);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('permissions', {
      name: { [Sequelize.Op.in]: entities.map(entity => entity.name) }
    }, {});
  }
};