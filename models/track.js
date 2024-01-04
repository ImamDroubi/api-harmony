'use strict';
const {Model} = require('sequelize');
module.exports =(sequelize, DataTypes) => {
  class Track extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Track.belongsTo(models.User);
      Track.belongsToMany(models.Combination, {through : models.Tracks_Combination , foreignKey:{name :'trackId'}});
      // Track.hasMany(models.Like,{
      //   foreignKey : {
      //     type : DataTypes.UUID,
      //     allowNull : true,
      //     name :'trackId'
      //   },
      //   onDelete : 'CASCADE'
      // });
      Track.belongsToMany(models.User, {
        as:'Likers',
        through: 'Tracks_Like',
        foreignKey : 'trackId',
        otherKey: 'userId'
      });
      Track.belongsTo(models.Category);
    }
  }
  Track.init({
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
    url : {
      type: DataTypes.STRING,
      allowNull : false,
      validate:{
        isUrl : true,
      }
    },
    photoUrl :{
      type : DataTypes.STRING,
      validate:{
        isUrl : true
      }
    },
    duration: DataTypes.INTEGER,
    isPublic:{
      type : DataTypes.BOOLEAN,
      defaultValue : false
    }
  }, {
    sequelize,
    modelName: 'Track',
  });
  return Track;
};