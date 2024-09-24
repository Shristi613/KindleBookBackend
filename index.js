const express=require("express");
const cors=require("cors");
const dotenv=require("dotenv");
const bookRoute=require("./routes/bookRoutes.js");
const authRoute=require("./routes/authRoutes.js");
const bodyParser=require("body-parser");

require('./db');
const app=express();

dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.json());
//config CORS
const corsOptions={
    origin:"*", //allow all origins (for development), for production,specify your details
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization']
};
app.use(cors(corsOptions));
//define routes
app.use("/api/books",bookRoute);
app.use("/api/auth",authRoute);
app.use('/uploads',express.static('uploads'));  //show files in uploads as static whenever we will call it in frontend, frontend will be able to erceive these files 

//create port
const port=process.env.PORT||5000;
app.listen(port,()=>console.log(`Listening on port ${port}`));