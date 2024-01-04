'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users_Categories', {
      categoryId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE', 
        primaryKey : true,
        references: {
          model : 'Categories',
          key : 'id'
        }
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',  
        primaryKey : true,   
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      name: {
        type: Sequelize.STRING
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users_Categories');
  }
};