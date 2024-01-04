'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('followers', {
      followerId:{
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        primaryKey: true,
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      followingId:{
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        primaryKey: true,
        references: {
          model: 'Users',
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
    return queryInterface.dropTable('followers');
  }
};