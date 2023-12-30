const jwt = require("jsonwebtoken");
const createError = require("./createError");

const verifyToken = async(req,res,next)=>{
  const token = req.cookies.access_token; 
  if(!token) return next(createError(401, "You aren't authorized"));
  jwt.verify(token , process.env.JWT_SECRET_KEY , (error, user)=>{
    if(error) return next(createError(401, "Token not valid."));
    req.user = user;
    return next();
  });
  
}

const verifyAdmin = async(req,res,next)=>{
  verifyToken(req,res, ()=>{
    if(!req.user?.admin) return next(createError(401, "Not Authorized."));
    return next(); 
  });
}

const verifyUser = async(req,res,next)=>{ 
  verifyToken(req,res, ()=>{
    if(req.user?.id !== req.params.id && !req.user?.admin) return next(createError(401, "Not Authorized."));
    return next();
  })
}
module.exports = {
  verifyToken,
  verifyAdmin,
  verifyUser
}