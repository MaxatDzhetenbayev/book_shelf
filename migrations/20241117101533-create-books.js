'use strict';

const sequelize = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: sequelize.INTEGER,
      },
      images: {
        type: sequelize.ARRAY(sequelize.STRING),
        allowNull: false,
      },
      author: {
        type: sequelize.STRING,
        allowNull: false,
      },
      content: {
        type: sequelize.JSONB,
        allowNull: false,
      },
      genre_id: {
        type: sequelize.INTEGER,
        references: {
          model: 'genres',
          key: 'id',
        },
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('books');
  },
};
