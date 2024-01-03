'use strict';
const {Model} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tracks_Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Tracks_Like.belongsTo(models.User);
    }
  }
  Tracks_Like.init({
  }, {
    sequelize,
    modelName: 'Tracks_Like',
  });
  return Tracks_Like;
};