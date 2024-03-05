import { Admin } from "../model/Admin.model.js";

export default async function AdminLogin(req,res){

       const {email,password}=req.body;

      const result=await Admin.findOne({email});

      console.log(result);

       if(!result){
        return res.status(401).json({"message":"No such User"});
       }

      const check=await result.isPasswordCorrect(password);
       
      console.log(check);

       if(!check){
         return res.status(401).json({"message":"wrong password"});
       }

      const accessToken=await result.generateAccessToken();
      const refreshToken=await result.generateRefreshToken();

       console.log(accessToken);
       console.log(refreshToken);

       result.refreshToken=refreshToken;
       result.save({validateBeforeSave:false});

       return res.status(200).cookie("accesstoken",accessToken,{httpOnly:true,secure:true}).json({"accesstoken":accessToken});
    
      }

      