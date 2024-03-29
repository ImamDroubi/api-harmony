'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tracks_Combination extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Tracks_Combination.init({
    volume:{
      type : DataTypes.INTEGER,
      defaultValue: 50,
      allowNull : false
    },
  }, {
    sequelize,
    modelName: 'Tracks_Combination',
  });
  return Tracks_Combination;
};