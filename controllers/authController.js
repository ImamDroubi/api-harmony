const {User, sequelize} = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
module.exports = {
  register : async(req,res,next)=>{
  const {username , email , password} = req.body ;
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
    const {password, ...reducedUser} = user.dataValues;
    console.log(reducedUser);
    res.cookie("access_token" , token)
    .status(201)
    .json(reducedUser);
    await trans.commit(); 
  }catch(error){
    await trans.rollback(); 
    next(error);
  }
}
}

/*
validate:{
  is: ["^(?=.*[a-z])(?=.*[A-Z])[A-Za-z]{8,}$"],// min 8 chars,one upper one lower letter
}
*/