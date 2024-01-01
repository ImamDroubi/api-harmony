const {Track} = require("../models");
const createError = require("./createError");
const verifyTracks = async(req,res,next)=>{
  const tracks = req.body.tracks; 
  if(!tracks) return next();
  const dbTracks = await Track.findAll({
    where : {
      id : tracks.map(track => track.id),
      userId : req.user?.id
    }
  });
  // not all provided tracks belong to the user
  if(dbTracks?.length !== tracks.length){
    return next(createError(401, "Not Authorized."));
  }
  return next();
}
module.exports ={
  verifyTracks
}