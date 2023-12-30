'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up : (queryInterface, Sequelize)=> {
    return queryInterface.createTable('combinations',{
      id:{
        type : Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        unique : true
      },
      name :{
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
          max:30,
          notEmpty: true,
        }
      },
      category:{
        type: Sequelize.STRING,
        validate :{
          max:30
        }
      },
      userId: {
        type: Sequelize.UUID,
        onDelete: 'CASCADE',
        references: {
          model: 'Users',
          key: 'id',
        }
      },
      isPublic:{
        type : Sequelize.BOOLEAN,
        defaultValue : false
      },
      photoUrl :{
        type : Sequelize.STRING,
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