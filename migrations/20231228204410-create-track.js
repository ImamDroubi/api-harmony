'use strict';


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up : (queryInterface, Sequelize)=> {
    return queryInterface.createTable('tracks',{
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
      url : {
        type: Sequelize.STRING,
        allowNull : false,
        validate:{
          isUrl : true,
        }
      },
      photoUrl :{
        type : Sequelize.STRING,
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
      duration: Sequelize.INTEGER,
      isPublic:{
        type : Sequelize.BOOLEAN,
        defaultValue : false
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
    return queryInterface.dropTable('tracks');
  }
}