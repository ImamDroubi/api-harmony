const {User, Track, Combination, Like} = require("../models");
const createError = require("../utilities/createError");

module.exports = {
  toggleLikeTrack : async(req,res,next)=>{
    const trans = await Track.sequelize.transaction();
    try {
      const track = await Track.findOne({
        where : {
          id : req.params.id
        }
      });
      if(!track) return next(createError(404, "Track not found."));
      const isLiked = await track.hasLiker(req.user.id);
      let message = "";
      if(isLiked){
        await track.removeLiker(req.user.id , {transaction : trans});
        message = "Like removed successfully.";
      }else{
        await track.addLiker(req.user.id , {transaction : trans});
        message = "Like added successfully.";
      }
      res
      .status(200)
      .json(message);

      await trans.commit();
    } catch (error) {
      await trans.rollback();
      next(error);
    }
  },
  getTrackLikes : async(req,res,next)=>{
    try {
      const track = await Track.findOne({
        where : {
          id : req.params.id
        }
      });
      if(!track) return next(createError(404, "Track not found."));
      const count = await track.countLikers();
      res
      .status(200)
      .json({"likes" : count});
    } catch (error) {
      next(error);
    }
  },
  toggleLikeCombination : async(req,res,next)=>{
    const trans = await Combination.sequelize.transaction();
    try {
      const combination = await Combination.findOne({
        where : {
          id : req.params.id
        }
      });
      if(!combination) return next(createError(404, "Combination not found."));
      const isLiked = await combination.hasLiker(req.user.id);
      let message = "";
      if(isLiked){
        await combination.removeLiker(req.user.id , {transaction : trans});
        message = "Like removed successfully.";
      }else{
        await combination.addLiker(req.user.id , {transaction : trans});
        message = "Like added successfully.";
      }
      res
      .status(200)
      .json(message);

      await trans.commit();
    } catch (error) {
      await trans.rollback();
      next(error);
    }
  },
  getCombinationLikes : async(req,res,next)=>{
    try {
      const combination = await Combination.findOne({
        where : {
          id : req.params.id
        }
      });
      if(!combination) return next(createError(404, "Combination not found."));
      const count = await combination.countLikers();
      res
      .status(200)
      .json({"likes" : count});

    } catch (error) {
      next(error);
    }
  }
}