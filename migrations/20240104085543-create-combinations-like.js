'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Combinations_Likes', {
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        primaryKey : true,
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      combinationId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        primaryKey : true,
        references: {
          model: 'Combinations',
          key: 'id',
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Combinations_Likes');
  }
};