'use strict';


/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up : (queryInterface, Sequelize)=> {
    return queryInterface.createTable('tracks_combinations',{
      trackId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        primaryKey: true,
        references: {
          model: 'Tracks',
          key: 'id',
        }
      },
      combinationId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        primaryKey: true,
        references: {
          model: 'Combinations',
          key: 'id',
        }
      },
      volume:{
        type : Sequelize.INTEGER,
        defaulValue: 50,
        allowNull : false
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
    return queryInterface.dropTable('tracks_combinations');
  }
}