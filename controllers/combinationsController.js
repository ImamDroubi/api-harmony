const {Combination,Track,Tracks_Combination ,User,Category, sequelize,Combinations_Like,Like, Sequelize} = require("../models");
const createError = require("../utilities/createError");
const { capetalize, reformCombination } = require("../utilities/reform");

module.exports = {
  createCombination : async(req,res,next)=>{
    const {name, category, photoUrl, isPublic ,description, tracks} = req.body ;
    const trans = await Combination.sequelize.transaction();
    console.log(category);
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
      const trackInstances = await Track.findAll({
        where :{
          id : [tracks.map(track=>track.id)]
        }
      });
      const tracksToInsert = trackInstances.map((Track)=>{
        const match = tracks.filter(track=>track.id === Track.dataValues.id);
        Track.Tracks_Combination = {
          volume : match[0].volume
        };
        return Track;
      })
      const combination = await Combination.create({
        name,
        categoryId : db_category?.dataValues.id,
        photoUrl,
        description,
        isPublic,
        userId : req.user.id
      },{transaction : trans});

      await combination.addTracks(
        tracksToInsert,
        {transaction :trans})
      
      combination.dataValues.tracks = req.body.tracks ;
      res
      .status(201)
      .json(combination.dataValues);
      await trans.commit();
    } catch (error) {
      await trans.rollback();
      next(error);
    }
  },
  cloneCombination: async(req,res,next)=>{
    const combinationId = req.params.id ;
    if(!combinationId){
      return next(createError(500, "Provide a combination to be cloned!"));
    }
    const combination = await Combination.findOne({
      where : {
        id : combinationId
      },
      include: {
        model : Track
      }
    });
    if(!combination)return next(createError(404, "combination not found!"));
    if(!combination.isPublic)return next(createError(401, "This is not a public combination!"));
    const {name, categoryId, photoUrl,description, Tracks} = combination; 
    const tracks = Tracks.map(track=>{
      return {
        name : track.dataValues.name,
        categoryId : track.dataValues.categoryId, 
        duration : track.dataValues.duration, 
        userId: req.user.id,
        url : track.dataValues.url, 
        photoUrl : track.dataValues.photoUrl,
        Tracks_Combination : track.dataValues.Tracks_Combination
      }
    }); 

    const trans = await Combination.sequelize.transaction();   
    try {
      const newcombination = await Combination.create({
        name,
        categoryId,
        userId: req.user.id,
        photoUrl,
        isPublic : false,
        description,
        Tracks : tracks
      },{
        include : [Track]
      }, {transaction:trans})
      res
      .status(201)
      .json(newcombination);
      await trans.commit();
    } catch (error) {
      await trans.rollback();
      return next(error);
    }
    
  },
  getAllCombinations: async(req,res,next)=>{
    try{
      let combinations = await Combination.findAll({
        include:[
          {
            model : Track,
            attributes :['id','url'],
            through : {Tracks_Combination , attributes: ['volume']}
          },
          {
            model : Category,
            attributes :['name']
          },
          {
            model: User,
            attributes :['id', 'username']
          },
          {
            model: User,
            as: 'Likers',
            attributes:['id'],
            through:{
              Combinations_Like,
              attributes:[]
            }
          }
        ]
      });
      combinations = combinations.map(comb=>{
        return reformCombination(comb,req.user?.id);
      })
      res
      .status(200)
      .json(combinations);
    }catch(err){
      next(err);
    }
  },
  // get all public combinations 
  getAllPublicCombinations: async(req,res,next)=>{
    const {category} = req.params; 
    let capetalizedCategory = capetalize(category);
    let categoryId = undefined; 
    let combinations = [];
    
    if(category){
      try {
        let category = await Category.findOne({
          where : {
            name : capetalizedCategory
          }
        });
        if(category)categoryId= category.dataValues.id; 
        else categoryId = -1; 

        combinations = await Combination.findAll({
          where :{
            isPublic : true,
            categoryId: categoryId
          },
          include:[
            {
              model : Track,
              attributes :['id','url'],
              through : {Tracks_Combination , attributes: ['volume']}
            },
            {
              model : Category,
              attributes :['name']
            },
            {
              model: User,
              attributes :['id', 'username']
            },
            {
              model: User,
              as: 'Likers',
              attributes:['id'],
              through:{
                Combinations_Like,
                attributes:[]
              }
            }
          ]
        });

      } catch (error) {
        return next(error);
      }
    }else{
      try{
        combinations = await Combination.findAll({
          where :{
            isPublic : true
          },
          include:[
            {
              model : Track,
              attributes :['id','url'],
              through : {Tracks_Combination , attributes: ['volume']}
            },
            {
              model : Category,
              attributes :['name']
            },
            {
              model: User,
              attributes :['id', 'username']
            },
            {
              model: User,
              as: 'Likers',
              attributes:['id'],
              through:{
                Combinations_Like,
                attributes:[]
              }
            }
          ]
        });
      }catch(err){
        next(err);
      }
    }   
    combinations = combinations.map(comb=>{
      return reformCombination(comb,req.user?.id);
    })
    res
    .status(200)
    .json(combinations);
  },
  // get user public combinations 
  getUserPublicCombinations: async(req,res,next)=>{
    try {
      let combinations= await Combination.findAll({
        where : { 
          userId : req.params.id, 
          isPublic : true
        },
        include:[
          {
            model : Track,
            attributes :['id','url'],
            through : {Tracks_Combination , attributes: ['volume']}
          },
          {
            model : Category,
            attributes :['name']
          },
          {
            model: User,
            attributes :['id', 'username']
          },
          {
            model: User,
            as: 'Likers',
            attributes:['id'],
            through:{
              Combinations_Like,
              attributes:[]
            }
          }
        ]
      })
      combinations = combinations.map(comb=>{
        return reformCombination(comb,req.user?.id);
      })
    res
    .status(200)
    .json(combinations);
    } catch (error) {
      next(error);
    }

  },
  // get user combinations
  getUserCombinations: async(req,res,next)=>{
    try {
    let combinations = await Combination.findAll({
      where : {
        userId: req.params.id
      },
      include:[
        {
          model : Track,
          attributes :['id','url'],
          through : {Tracks_Combination , attributes: ['volume']}
        },
        {
          model : Category,
          attributes :['name']
        },
        {
          model: User,
          attributes :['id', 'username']
        },
        {
          model: User,
          as: 'Likers',
          attributes:['id'],
          through:{
            Combinations_Like,
            attributes:[]
          }
        }
      ]
    })

    combinations = combinations.map(comb=>{
      return reformCombination(comb,req.user?.id);
    })
    
    res
    .status(200)
    .json(combinations);
    } catch (error) {
      next(error);
    }

  },
  // get combination 
  getCombination: async(req,res,next)=>{
    try {
      let combination = await Combination.findOne({
        where : {
          id : req.params.id
        },
        include:[
          {
            model : Track,
            attributes :['id','url'],
            through : {Tracks_Combination , attributes: ['volume']}
          },
          {
            model : Category,
            attributes :['name']
          },
          {
            model: User,
            attributes :['id', 'username']
          }
        ]
      });
      if(!combination) return next(createError(404, "Combination not found."));
      if(combination.dataValues.userId !== req.user?.id
        && combination.dataValues.isPublic === false 
        && !req.user?.admin)
        return next(createError(401, "Not Authorized."));

      combination = reformCombination(combination,req.user?.id);
      res
      .status(200)
      .json(combination);
    } catch (error) {
      next(error);
    }

  },
  // update combination
  updateCombination : async(req,res,next)=>{
    const {id, userId, createdAt,category, updatedAt,tracks, ...details} = req.body; 
    const trans = await Combination.sequelize.transaction(); 
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
      const combination = await Combination.findOne({
        where : {
          id : req.params.id
        }
      });
      if(!combination) return next(createError(404, "Combination not found."));
      if(combination.dataValues.userId !== req.user?.id && !req.user?.admin)
        return next(createError(401, "Not Authorized."));
      await Combination.update({
        categoryId : db_category?.dataValues.id,
        ...details
      },{
        where: {
          id : req.params.id
        }
      }, {transaction : trans});
      if(tracks){
        // remove the previous tracks from the track-combination table and create new ones
        await Tracks_Combination.destroy({
          where : {
            combinationId : req.params.id
          },
        },{transaction : trans});
        const trackInstances = await Track.findAll({
          where :{
            id : [tracks.map(track=>track.id)]
          }
        });
        const tracksToInsert = trackInstances.map((Track)=>{
          const match = tracks.filter(track=>track.id === Track.dataValues.id);
          Track.Tracks_Combination = {
            volume : match[0].volume
          };
          return Track;
        });
        await combination.addTracks(
        tracksToInsert,
        {transaction :trans});
      }
      res
      .status(200)
      .json("Combination Updated Successfully.");
      await trans.commit();
    }catch(err){
      await trans.rollback();
      next(err);
    }
  },
  // delete combination
  deleteCombination : async(req,res,next)=>{
    const trans = await Combination.sequelize.transaction(); 
    try {
      const combination = await Combination.findOne({
        where: {
          id : req.params.id
        }
      });
      if(!combination) return next(createError(404, "Combination not found."));
      if(combination.dataValues.userId !== req.user?.id && !req.user?.admin)
        return next(createError(401, "Not Authorized."));
      await combination.destroy({transaction : trans});
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