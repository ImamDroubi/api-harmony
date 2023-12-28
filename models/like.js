'use strict';
import { Model } from 'sequelize';
module.exports = (sequelize, DataTypes) => {
  const allowedObjects = ["user" , "track", "combination"];
  class Like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Like.belongsTo(models.User);
    }
  }
  Like.init({
    id:{
      type : DataTypes.UUID,
      defaulValue: DataTypes.UUIDV4,
      primaryKey: true,
      unique : true,
      allowNull : false
    },
    objectId:{
      type : DataTypes.UUID,
      allowNull : false
    },
    type:{
      type : DataTypes.STRING,
      allowNull : false,
      validate :{
        isValid(value){
          if(allowedObjects.findIndex(value) === -1){
            throw new Error('Type can only be user, track or combination!');
          }
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Like',
  });
  return Like;
};