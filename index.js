const express = require("express");
const {User} = require("./models");
const authRoute = require("./routes/authRoute");
const trackRoute = require("./routes/trackRoute");
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
app.use("/api/tracks" , trackRoute)

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