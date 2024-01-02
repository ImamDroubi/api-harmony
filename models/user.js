'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Track, {
        foreignKey : {
          type : DataTypes.UUID,
          allowNull : false,
          name :'userId'
        },
        onDelete : 'CASCADE'
      });

      User.hasMany(models.Like,{
        foreignKey : {
          type : DataTypes.UUID,
          allowNull : false,
          name :'userId'
        },
        onDelete : 'CASCADE'
      });
      User.hasMany(models.Combination, {
        foreignKey : {
          type : DataTypes.UUID,
          allowNull : false,
          name :'userId'
        },
        onDelete : 'CASCADE'
      });
      User.belongsToMany(models.User, {as:'Followees', through:'Follower', foreignKey:'followerId' , otherKey : 'followingId'});
      User.belongsToMany(models.User , {as:'Followers',through: 'Follower', foreignKey : 'followingId' , otherKey: 'followerId'});
    }
  }
  User.init({
    id:{
      type : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique : true,
    },
    username :{
      type: DataTypes.STRING,
      allowNull : false,
      unique : true,
      validate:{
        min:6,
        max:15,
        notEmpty: true,
      }
    },
    email:{
      type : DataTypes.STRING,
      allowNull : false,
      unique : true,
      validate:{
        isEmail:true,
        notEmpty: true, 
      }
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture : {
      type: DataTypes.STRING,
      validate:{
        isUrl : true,
      }
    },
    isAdmin:{
      type : DataTypes.BOOLEAN,
      defaultValue : false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};