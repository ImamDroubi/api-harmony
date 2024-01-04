'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.belongsToMany(models.User,{
        through : 'Users_Category',
        foreignKey : 'categoryId'
      });

      Category.hasMany(models.Track, {
        foreignKey : {
          allowNull : true,
          name :'categoryId'
        },
        onDelete : 'SET NULL'
      });
      Category.hasMany(models.Combination, {
        foreignKey : {
          allowNull : true,
          name :'categoryId'
        },
        onDelete : 'SET NULL'
      });
      
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
      unique:true,
      validate : {
        max : 30
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};