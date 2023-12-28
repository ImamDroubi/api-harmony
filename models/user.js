'use strict';
import { Model } from 'sequelize';
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
    }
  }
  User.init({
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
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};