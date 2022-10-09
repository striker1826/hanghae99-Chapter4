'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up : async(queryInterface, Sequelize) => {
    await queryInterface.createTable('likes', {
      userId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      postId: {
        type: Sequelize.STRING
      },
      user: {
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
    });
  },
  down : async(queryInterface, Sequelize) => {
    await queryInterface.dropTable('likes');
  }
};