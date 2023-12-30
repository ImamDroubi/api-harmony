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
      Combination.belongsToMany(models.Track, {through: models.TrackCombination, foreignKey:{name :'trackId'}});
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
    category:{
      type: DataTypes.STRING,
      validate :{
        max:30
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