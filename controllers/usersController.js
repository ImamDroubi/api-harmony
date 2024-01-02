const {User} = require("../models");
const bcrypt = require('bcrypt');
const createError = require("../utilities/createError");

module.exports = {
  getAllUsers : async(req,res,next)=>{
    try {
      const users = await User.findAll(
        {attributes : ['username', 'email' , 'profilePicture' , 'isAdmin']}
      );
      res
      .status(200)
      .json(users);
    } catch (error) {
      next(error);
    }
  },

  getUser : async(req,res,next)=>{
    try {
      const user = await User.findOne({
        where : {
          id : req.params.id
        },
        attributes : ['username', 'email' , 'profilePicture']
      });
      res
      .status(200)
      .json(user);
    } catch (error) {
      next(error);
    }
  },

  updateUser : async(req,res,next)=>{
    const {username, profilePicture, email} = req.body;
    const trans = await User.sequelize.transaction();
    try {
      const updatedUser = await User.update({
        username,
        profilePicture,
        email // remember email validation
      },{
        where : {
          id : req.params.id
        }
      },{transaction : trans});
      
      res
      .status(200)
      .json("User Updated Successfully.");
      await trans.commit();
    } catch (error) {
      await trans.rollback();
      next(error);
    }
  },
  updatePassword : async(req,res,next)=>{
    const trans = await User.sequelize.transaction();
    if(!req.body.oldPassword || !req.body.password){
      return next(createError(400, "Provide password and old password."));
    }
    try {
      const user = await User.findOne({
        where :{
          id : req.params.id
        }
      });
      if(!user){
        return next(createError(404, "User not registered."));
      }
      const match = await bcrypt.compare(req.body.oldPassword, user.password);
      if(!match){
        return next(createError(401, "Wrong credintials."));
      }
      // remember : Add password validation later 
      const saltRounds= 10 ;
      const hash = await bcrypt.hash(req.body.password, saltRounds);
      await User.update({
        password : hash
      },{
        where : {
          id : req.params.id
        }
      },{transaction : trans});

      res
      .status(200)
      .json("Password Updated Sunccessfully.");
      
      await trans.commit();
    } catch (error) {
      await trans.rollback();
      next(error);
    }
  }
  ,
  grantAdmin : async(req,res,next)=>{
    const trans = await User.sequelize.transaction();
    try {
      await User.update({
        isAdmin : true
      },{
        where : {
          id : req.params.id
        }
      },{transaction : trans});
      res
      .status(200)
      .json("User updated successfully.");
    }
    catch (error) {
      trans.rollback();
      next(error);
    }
  },
  revokeAdmin : async(req,res,next)=>{
    const trans = await User.sequelize.transaction();
    try {
      await User.update({
        isAdmin : false
      },{
        where : {
          id : req.params.id
        }
      },{transaction : trans});
      res
      .status(200)
      .json("User updated successfully.");
    }
    catch (error) {
      trans.rollback();
      next(error);
    }
  },
  deleteUser : async(req,res,next)=>{
    try{
      const trans = await User.sequelize.transaction();
      User.destroy({
        where : {
          id : req.params.id
        }
      }, {transaction : trans});
      if(!req.user.admin){
        res.clearCookie("access_token");
      }
      res
      .status(200)
      .json("User deleted successfully.");

      await trans.commit();
    }catch(error){
      await trans.rollback();
      next(error);
    }
  }
}