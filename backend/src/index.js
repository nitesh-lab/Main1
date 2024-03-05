import express, { urlencoded } from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import cors from "cors";
import { ConnectDB } from "./database/database.js";
import { Userrouter } from "./routes/user.router.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import { ConnectSocket } from "./services/socket.js";
import { Adminrouter } from "./routes/admin.route.js";
import { Admin } from "./model/Admin.model.js";
import { ChannelRouter } from "./routes/channel.route.js";
import "./model/Channel.model.js";

dotenv.config({
    path:"/.env"
})

const app=express();

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials:true,
}));

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/user",Userrouter);
app.use("/admin",Adminrouter);
app.use("/channel",ChannelRouter);

 const server=createServer(app);

       await ConnectDB().then(()=>{
        server.listen(3000,()=>{
            console.log("listneing to"+process.env.PORT)
        })
       })
       .catch((e)=>{
        console.log("Mongo DB Cnnection Failed"+e);
       })

    ConnectSocket(server);
    
app.post("/create",async(req,res)=>{

    const {email,password}=req.body;

   const result= await Admin.create({
        email,password
    })
    res.json({"data":result});
})

app.get("/memory",(req,res)=>{
    res.send( process.memoryUsage());
})