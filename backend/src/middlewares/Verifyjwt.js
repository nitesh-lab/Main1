import jwt from "jsonwebtoken";
import { User } from "../model/User.model.js";

export  default async function verifyJWT(req,res,next){

        let token;
        if(!req.headers.authorization && !req.cookies.token ){
           return res.status(401).json({"message":"Authentication Token Required","check":false});
        }
    
        if(req.headers.authorization){
     token=req.headers?.authorization?.replace("Bearer ",""); 
    
    if(token.length<10){
       return res.status(401).json({"message":"unauthorized","check":false});
    }
}
    if(req.cookies.token){
        token=req.cookies.token;
    }

    const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

   
    const user=await User.findById(decodedtoken?._id).select("-password -refreshToken")

        if(!user){
            return res.status(401).json({"message":"No such user","check":false})
        }

    req.user=user;
    next();
}