'use strict';


/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up : (queryInterface, Sequelize)=> {
    return queryInterface.createTable('tracks_likes',{
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        primaryKey : true,
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      trackId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        primaryKey : true,
        references: {
          model: 'Tracks',
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
    down: (queryInterface, Sequelize)=> {
    return queryInterface.dropTable('tracks_likes');
  }
}