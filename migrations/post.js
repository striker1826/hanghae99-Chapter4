'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up : async(queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      likes: {
        allowNull: false,
        type: Sequelize.INTEGER
      }
    });
  },
  down : async(queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  }
};