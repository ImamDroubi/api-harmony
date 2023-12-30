const {User, sequelize} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const createError = require("../utilities/createError");
module.exports = {
  register : async(req,res,next)=>{
  const {username , email} = req.body ;
  const saltRounds= 10 ;
  const trans = await sequelize.transaction();
  
  try{
    const hash = await bcrypt.hash(req.body.password, saltRounds);
    const user = await User.create({
      username,
      email,
      password : hash
    },{ transaction: trans })
    const token = jwt.sign({id:user.id, admin:false} , process.env.JWT_SECRET_KEY); 
    const {password,isAdmin, ...reducedUser} = user.dataValues;
    res.cookie("access_token" , token)
    .status(201)
    .json(reducedUser);
    await trans.commit(); 
  }catch(error){
    await trans.rollback(); 
    next(error);
  }
  },

  login : async(req,res,next)=>{
    try{
      const user = await User.findOne({
        where :{
          email : req.body.email
        }
      });
      if(!user){
        next(createError(404, "User not registered."));
      }
      const match = await bcrypt.compare(req.body.password, user.password);
      if(!match){
        next(createError(401, "Wrong credintials."));
      }
      const token = jwt.sign({id:user.id, admin:user.isAdmin} , process.env.JWT_SECRET_KEY);
      const {password,isAdmin, ...reducedUser} = user.dataValues;

      res.cookie("access_token" , token)
      .status(200)
      .json(reducedUser);
    }catch(error){
      next(error);
    }
  },

}

/*
validate:{
  is: ["^(?=.*[a-z])(?=.*[A-Z])[A-Za-z]{8,}$"],// min 8 chars,one upper one lower letter
}
*/