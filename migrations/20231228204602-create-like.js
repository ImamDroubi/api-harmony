'use strict';

const {DataTypes} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up : (queryInterface, Sequelize)=> {
    return queryInterface.createTable('likes',{
      id:{
        type : DataTypes.UUID,
        defaulValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique : true,
        allowNull : false
      },
      userId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      objectId:{
        type : DataTypes.UUID,
        allowNull : false
      },
      type:{
        type : DataTypes.STRING,
        allowNull : false,
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
    return queryInterface.dropTable('likes');
  }
}