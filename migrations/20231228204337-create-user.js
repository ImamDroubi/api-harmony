'use strict';

const {DataTypes} = require("sequelize");
/** @type {import('sequelize-cli').Migration} */
module.exports = {
up : (queryInterface, Sequelize)=> {
  return queryInterface.createTable('users', {
    id:{
      type : DataTypes.UUID,
      defaulValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique : true,
      allowNull : false
    },
    username :{
      type: DataTypes.STRING,
      allowNull : false,
      validate:{
        min:6,
        max:15,
        notEmpty: true,
      }
    },
    email:{
      type : DataTypes.STRING,
      allowNull : false,
      validate:{
        isEmail:true,
        notEmpty: true, 
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        is: ["^(?=.*[a-z])(?=.*[A-Z])[A-Za-z]{8,}$"],// min 8 chars,one upper one lower letter
      }
    },
    profilePicture : {
      type: DataTypes.STRING,
      validate:{
        isUrl : true,
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
  return queryInterface.dropTable('users');
}
}

