'use strict';
import { Model } from 'sequelize';
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
    isPublic:{
      type : DataTypes.BOOLEAN,
      defaulValue : false
    }
  }, {
    sequelize,
    modelName: 'Combination',
  });
  return Combination;
};