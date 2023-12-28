'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  class TrackCombination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TrackCombination.init({
    volume:{
      type : DataTypes.INTEGER,
      defaulValue: 50,
      allowNull : false
    },
  }, {
    sequelize,
    modelName: 'TrackCombination',
  });
  return TrackCombination;
};