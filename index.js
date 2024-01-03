const express = require("express");
const {User} = require("./models");
const authRoute = require("./routes/authRoute");
const tracksRoute = require("./routes/tracksRoute");
const combinationsRoute = require("./routes/combinationsRoute");
const usersRoute = require("./routes/usersRoute");
const likesRoute = require("./routes/likesRoute");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8000 ; 

const app = express();
dotenv.config(); 

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//MIDDLEWARES
app.use(cookieParser()); 
app.use(express.json());


//ROUTES
app.use("/api/auth" , authRoute)
app.use("/api/tracks" , tracksRoute)
app.use("/api/combinations" , combinationsRoute)
app.use("/api/users" , usersRoute)
app.use("/api/likes" , likesRoute)

// ERROR HANDLING 
app.use((err,req,res,next)=>{
  res.status(err.status || 500).json({
    "success" : false,
    "status" : err.status || 500,
    "message" : err.message || "Something Went Wrong!",
    "stack" : err.stack
  });
});

app.listen(PORT , ()=>{
  console.log(`Connected to backend on port ${PORT}`);
})