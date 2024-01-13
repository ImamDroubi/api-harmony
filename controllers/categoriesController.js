const {Category, User} = require("../models");
const createError = require("../utilities/createError");
const { capetalize } = require("../utilities/reform");
module.exports = {
  createCategory : async(req,res,next)=>{
    const trans = await Category.sequelize.transaction();
    const category = capetalize(req.body.category);
    if(!category)return next(createError(400, "No Category Provided."));
    try{
      const [db_category, created] = await Category.findOrCreate({
        where : {name : category},
        transaction : trans
      });
      res
      .status(201)
      .json(`${db_category.dataValues.name} category successfully created.`);
      await trans.commit();
    }catch(error){
      await trans.rollback();
      next(error);
    }
  },
  getAllCategories : async(req,res,next)=>{
    try {
      const categories = await Category.findAll();
      res
      .status(200)
      .json(categories);
    } catch (error) {
      next(error);
    }
  },
  getMyCategories : async(req,res,next)=>{
    try {
      const user = await User.findOne({
        where :{id : req.user.id}
      });
      const categories = await user.getCategories({joinTableAttributes : ['name']});
      res
      .status(200)
      .json(categories);
    } catch (error) {
      next(error);
    }
  },
  getUserCategories : async(req,res,next)=>{
    try {
      const user = await User.findOne({
        where :{id : req.params.id}
      });
      const categories = await user.getCategories({joinTableAttributes : ['name']});
      res
      .status(200)
      .json(categories);
    } catch (error) {
      next(error);
    }
  },
  deleteCategory : async(req,res,next)=>{
    const trans = await Category.sequelize.transaction();
    try{
      const category = await Category.findOne({
        where : { id: req.params.id }
      })
      if(!category)return next(createError(404, "Category not found."));
      const name = category.dataValues.name;
      await category.destroy({transaction:trans});
      res
      .status(200)
      .json(`Category ${name} Deleted Successfully.`);
      await trans.commit();
    }catch(error){
      await trans.rollback();
      next(error);
    }
  }
  
}