---
to: database/seeders/<%= h.timestamp() %>-add-<%= h.inflection.dasherize(h.inflection.underscore(h.inflection.pluralize(name))) %>-crud-permissions.js
---
const entities = [];
const now = new Date();

entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.list', level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.create', level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.show', level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.update', level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.destroy', level:'low', created_at: now, updated_at: now });
entities.push({ name: '<%= h.inflection.underscore(h.inflection.pluralize(name)) %>.status', level:'low', created_at: now, updated_at: now });

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