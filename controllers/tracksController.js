const {Track ,User,Category} = require("../models");
const createError = require("../utilities/createError");
const { capetalize } = require("../utilities/reform");

module.exports = {
  createTrack : async(req,res,next)=>{
    const {name, url, category, duration, photoUrl, isPublic} = req.body ;
    const trans = await Track.sequelize.transaction();
    try {
      const capetalizedCategory = capetalize(category);
      let db_category = undefined; 
      if(category){
        // get the category ID and carete one if it's the first time 
        const [instance, created] = await Category.findOrCreate({
          where : {name : capetalizedCategory}
        });
        db_category =instance;
        
        // add the category to the user categories 
        const hasCategory = await instance.hasUser(req.user.id);
        if(!hasCategory){
          await instance.addUser(req.user.id,{ through: { name: capetalizedCategory }}, {transaction : trans});
        }
      }
      const track = await Track.create({
        name,
        url,
        duration,
        categoryId: db_category?.dataValues.id,
        photoUrl,
        isPublic,
        userId : req.user.id
      },{transaction : trans});
      res
      .status(201)
      .json(track.dataValues);
      await trans.commit();
    } catch (error) {
      await trans.rollback();
      next(error);
    }
  },
  getAllTracks: async(req,res,next)=>{
    try{
      const tracks = await Track.findAll(
        {
          include : [
            {
              model : Category,
              attributes :['name']
            },
            {
              model : User ,
              attributes : ['username']
            }
          ],
        }
      );
      res
      .status(200)
      .json(tracks);
    }catch(err){
      next(err);
    }
  },
  // get all public tracks 
  getAllPublicTracks: async(req,res,next)=>{
    try{
      const tracks = await Track.findAll({
        where :{
          isPublic : true
        },
        include : [
          {
            model : Category,
            attributes :['name']
          },
          {
            model : User ,
            attributes : ['username']
          }
        ],
      });
      res
      .status(200)
      .json(tracks);
    }catch(err){
      next(err);
    }
  },
  // get user public tracks 
  getUserPublicTracks: async(req,res,next)=>{
    try {
    const tracks = await Track.findAll({
      where:{
        userId : req.params.id,
        isPublic : true
      },
      include : [
        {
          model : Category,
          attributes :['name']
        },
        {
          model : User ,
          attributes : ['username']
        }
      ],
    })
    res
    .status(200)
    .json(tracks);
    } catch (error) {
      next(error);
    }

  },
  // get user tracks
  getUserTracks: async(req,res,next)=>{
    try {
    const tracks = await Track.findAll({
      where:{
        userId : req.params.id
      },
      include : [
        {
          model : Category,
          attributes :['name']
        },
        {
          model : User ,
          attributes : ['username']
        }
      ],
    })
    res
    .status(200)
    .json(tracks);
    } catch (error) {
      next(error);
    }

  },
  // get track 
  getTrack: async(req,res,next)=>{
    try {
      const track = await Track.findOne({
        where : {
          id : req.params.id
        },
        include : [
          {
            model : Category,
            attributes :['name']
          },
          {
            model : User ,
            attributes : ['username']
          }
        ],
      });
      if(!track) return next(createError(404, "Track not found."));
      if(track.dataValues.userId !== req.user?.id
        && track.dataValues.isPublic === false 
        && !req.user?.admin)
        return next(createError(401, "Not Authorized."));
      res
      .status(200)
      .json(track);
    } catch (error) {
      next(error);
    }

  },
  //get multiple tracks 
  getTracks: async(req,res,next)=>{
    const { tracksIds = [] } = req.query ;
    try{
      const tracks = await Track.findAll({
        where : {
          id: tracksIds,
          userId : req.user.id
        }
      });
      res
      .status(200)
      .json(tracks);
    }catch(error){
      next(error);
    }
    
  },
  // update track
  updateTrack : async(req,res,next)=>{
    const trans = await Track.sequelize.transaction(); 
    try{
      const track = await Track.findOne({
        where : {
          id : req.params.id
        }
      });
      if(!track) return next(createError(404, "Track not found."));
      if(track.dataValues.userId !== req.user?.id && !req.user?.admin)
        return next(createError(401, "Not Authorized."));
      const {id, userId, createdAt, updatedAt, ...details} = req.body; 
      const updatedTrack = await Track.update({
        ...details
      },{
        where: {
          id : req.params.id
        }
      }, {transaction : trans});

      res
      .status(200)
      .json("Track Updated Successfully.");

      await trans.commit();
    }catch(err){
      await trans.rollback();
      next(err);
    }
  },
  // delete track
  deleteTrack : async(req,res,next)=>{
    const trans = await Track.sequelize.transaction(); 
    try {
      const track = await Track.findOne({
        where: {
          id : req.params.id
        }
      });
      if(!track) return next(createError(404, "Track not found."));
      if(track.dataValues.userId !== req.user?.id && !req.user?.admin)
        return next(createError(401, "Not Authorized."));
      await track.destroy({transaction : trans});
      res
      .status(200)
      .json("Deleted Successfully.");
      await trans.commit();
    } catch (error) {
      await trans.rollback();
      next(error);
    }
  }
}