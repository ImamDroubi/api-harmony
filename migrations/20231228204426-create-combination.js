'use strict';

const {DataTypes} = require("sequelize");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up : (queryInterface, Sequelize)=> {
    return queryInterface.createTable('combinations',{
      id:{
        type : DataTypes.UUID,
        defaulValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique : true,
        allowNull : false
      },
      name :{
        type: DataTypes.STRING,
        allowNull : false,
        validate:{
          max:30,
          notEmpty: true,
        }
      },
      category:{
        type: DataTypes.STRING,
        validate :{
          max:30
        }
      },
      userId: {
        type: DataTypes.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      isPublic:{
        type : DataTypes.BOOLEAN,
        defaulValue : false
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
    return queryInterface.dropTable('combinations');
  }
}