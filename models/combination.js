'use strict';
const {Model} = require('sequelize');
module.exports =(sequelize, DataTypes) => {
  class Combination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Combination.belongsTo(models.User);
      Combination.belongsToMany(models.Track, {through: models.Tracks_Combination, foreignKey:{name :'combinationId'}});
      Combination.belongsToMany(models.User, {
        as:'Likers',
        through: 'Combinations_Like',
        foreignKey : 'combinationId',
        otherKey: 'userId'
      });
      Combination.belongsTo(models.Category);
    }
  }
  Combination.init({
    id:{
      type : DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique : true,
    },
    name :{
      type: DataTypes.STRING,
      allowNull : false,
      validate:{
        max:30,
        notEmpty: true,
      }
    },
    photoUrl :{
      type : DataTypes.STRING,
      validate:{
        isUrl : true
      }
    },
    isPublic:{
      type : DataTypes.BOOLEAN,
      defaultValue : false
    }
  }, {
    sequelize,
    modelName: 'Combination',
  });
  return Combination;
};