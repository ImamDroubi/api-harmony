'use strict';

const {DataTypes} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up : (queryInterface, Sequelize)=> {
    return queryInterface.createTable('tracks_combinations',{
      trackId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        primaryKey: true,
        references: {
          model: 'Tracks',
          key: 'id',
        }
      },
      combinationId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        primaryKey: true,
        references: {
          model: 'Combinations',
          key: 'id',
        }
      },
      volume:{
        type : DataTypes.INTEGER,
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