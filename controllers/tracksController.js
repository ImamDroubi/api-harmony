const { Op } = require("sequelize");
const {Track ,User,Category,Tracks_Like} = require("../models");
const createError = require("../utilities/createError");
const { capetalize, reformTrack } = require("../utilities/reform");

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
      let tracks = await Track.findAll(
        {
          include : [
            {
              model : Category,
              attributes :['name']
            },
            {
              model : User ,
              attributes :['id', 'username']
            },
            {
              model: User,
              as: 'Likers',
              attributes:['id'],
              through:{
                Tracks_Like,
                attributes:[]
              }
            }
          ],
        }
      );

      tracks = tracks.map(track=>{
        return reformTrack(track, req.user?.id);
      });

      res
      .status(200)
      .json(tracks);
    }catch(err){
      next(err);
    }
  },
  // clone a public track from another user 
  cloneTrack: async(req,res,next)=>{
    const trackId = req.params.id ;
    if(!trackId){
      return next(createError(500, "Provide a track to be cloned!"));
    }
    const track = await Track.findOne({
      where : {
        id : trackId
      }
    });
    if(!track)return next(createError(404, "Track not found!"));
    if(!track.isPublic)return next(createError(401, "This is not a public track!"));
    const {name, categoryId, duration, url, photoUrl} = track; 
    const newTrack = {
      name,
      categoryId,
      duration,
      userId: req.user.id,
      url,
      photoUrl,
      isPublic : false
    }
    const trans = await Track.sequelize.transaction();
    try {
      const dbTrack = await Track.create({
        ...newTrack
      }, {transaction:trans})
      res
      .status(201)
      .json(dbTrack);
      await trans.commit();
    } catch (error) {
      await trans.rollback();
      return next(error);
    }
    
  },
  // get all public tracks 
  getAllPublicTracks: async(req,res,next)=>{
    const {category} = req.params; 
    let capetalizedCategory = capetalize(category);
    let categoryId = undefined; 
    let tracks = [];
    if(category){
      try {
        let category = await Category.findOne({
          where : {
            name : capetalizedCategory
          }
        });
        if(category)categoryId= category.dataValues.id; 
        else categoryId = -1; 

        tracks = await Track.findAll({
          where :{
            isPublic : true,
            categoryId : categoryId
          },
          include : [
            {
              model : Category,
              attributes :['name']
            },
            {
              model : User ,
              attributes :['id', 'username']
            },
            {
              model: User,
              as: 'Likers',
              attributes:['id'],
              through:{
                Tracks_Like,
                attributes:[]
              }
            }
          ],
        });

      } catch (error) {
        return next(error);
      }
    }else{
      try {
        tracks = await Track.findAll({
          where :{
            isPublic : true,
          },
          include : [
            {
              model : Category,
              attributes :['name']
            },
            {
              model : User ,
              attributes :['id', 'username']
            },
            {
              model: User,
              as: 'Likers',
              attributes:['id'],
              through:{
                Tracks_Like,
                attributes:[]
              }
            }
          ],
        }); 
      } catch (error) {
        return next(error);
      }
    }
    tracks = tracks.map(track=>{
      return reformTrack(track, req.user?.id);
    });
    res
    .status(200)
    .json(tracks);
  },
  // get user public tracks 
  getUserPublicTracks: async(req,res,next)=>{
    try {
    let tracks = await Track.findAll({
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
          attributes :['id', 'username']
        },
        {
          model: User,
          as: 'Likers',
          attributes:['id'],
          through:{
            Tracks_Like,
            attributes:[]
          }
        }
      ],
    })

    tracks = tracks.map(track=>{
      return reformTrack(track, req.user?.id);
    });
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
    let tracks = await Track.findAll({
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
          attributes :['id', 'username']
        },
        {
          model: User,
          as: 'Likers',
          attributes:['id'],
          through:{
            Tracks_Like,
            attributes:[]
          }
        }
      ],
    })

    tracks = tracks.map(track=>{
      return reformTrack(track, req.user?.id);
    });
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
      let track = await Track.findOne({
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
            attributes :['id', 'username']
          },
          {
            model: User,
            as: 'Likers',
            attributes:['id'],
            through:{
              Tracks_Like,
              attributes:[]
            }
          }
        ],
      });

      track = reformTrack(track, req.user?.id);
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
      let tracks = await Track.findAll({
        where : {
          id: tracksIds,
          userId : req.user.id
        },
        include : [
          {
            model : Category,
            attributes :['name']
          },
          {
            model : User ,
            attributes :['id', 'username']
          },
          {
            model: User,
            as: 'Likers',
            attributes:['id'],
            through:{
              Tracks_Like,
              attributes:[]
            }
          }
        ],
      });

      tracks = tracks.map(track=>{
        return reformTrack(track,req.user?.id);
      })
      res
      .status(200)
      .json(tracks);
    }catch(error){
      next(error);
    }
    
  },
  // update track
  updateTrack : async(req,res,next)=>{
    const {id, userId, createdAt,category, updatedAt, ...details} = req.body; 
    const trans = await Track.sequelize.transaction(); 
    try{
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
      const track = await Track.findOne({
        where : {
          id : req.params.id
        }
      });
      if(!track) return next(createError(404, "Track not found."));
      if(track.dataValues.userId !== req.user?.id && !req.user?.admin)
        return next(createError(401, "Not Authorized."));
      const updatedTrack = await Track.update({
        categoryId : db_category?.dataValues.id,
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