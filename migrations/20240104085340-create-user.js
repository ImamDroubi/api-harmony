'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
up : (queryInterface, Sequelize)=> {
  return queryInterface.createTable('users', {
    id:{
      type : Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
      unique : true,
    },
    username :{
      type: Sequelize.STRING,
      allowNull : false,
      unique : true,
      validate:{
        min:6,
        max:15,
        notEmpty: true,
      }
    },
    email:{
      type : Sequelize.STRING,
      allowNull : false,
      unique : true,
      validate:{
        isEmail:true,
        notEmpty: true, 
      }
    },
    password:{
      type: Sequelize.STRING,
      allowNull: false,
    },
    profilePicture : {
      type: Sequelize.STRING,
      validate:{
        isUrl : true,
      }
    },
    isAdmin:{
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
  return queryInterface.dropTable('users');
}
}

