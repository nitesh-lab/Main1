
import { User} from "../model/User.model.js";
import UploadonCloudinary from "../utils/uploadCloudinary.js";
import jwt from "jsonwebtoken";


export async function getAllUsers(req,res){

    const d=await User.find({});

    return res.json({d});
}

export async function Signup(req,res){

    console.log(req.body);
  
    const {Name,email,password}=req.body;

   const existedUser=await User.findOne({
        $or:[{Name,email}]
    });
   // console.log(existedUser);

    if(existedUser){
        return res.status(409).json({message:"User already exist"});
    }

    console.log(req.file);

    const result= await UploadonCloudinary(req.file.path);
    
    console.log(result.url);

    const user=await User.create({
        Name,email,password,avatar:result.url,
    });

    const createdUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
        return res.status(201).json({message:"inserted succesfully",createdUser});
    }

export async function Login(req,res){

    const d=req.body;

    const user=await User.findOne({email:req.body.email})

    if(!user){
        return res.status(400).json({"message":"NO SUCH USER"});
    }

    const isCorrect=await user.isPasswordCorrect(req.body.password);

    if(!isCorrect){
       return res.status(401).json({message:"wrong password"});
    }

    if(isCorrect){

        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateSecretToken();

        user.refreshToken=refreshToken;
       await user.save({validateBeforeSave:false});

        const options={
            httpOnly:true,
            secure:true,
        }

        const loggedinUser=await User.findById(user._id).select("-refreshToken -password");

        return res.status(200).cookie("accesstoken",accessToken,options).cookie("refreshtoken",refreshToken,options)
        .json({"accessToken":accessToken,user:loggedinUser});
    }
}

export async function RefreshAcessToken(req,res){

   const token=req.cookies.refreshtoken;

     const decodedtoken=jwt.verify(token,process.env.RefreshTokenSecret);

    const user=await User.findById(decodedtoken?._id);

    const options = {
        httpOnly: true,
        secure: true
    }

    const accessToken=await user.generateAccessToken();
    const refreshToken=await user.generateSecretToken();

    user.refreshToken=refreshToken;
    user.save({validateBeforeSave:false});

    return res.status(200).cookie("accessToken",accessToken,options)
    .cookie("refreshtoken",refreshToken,options).json({"accessToken":accessToken,"message":"created Successfully"})
}

export async function CheckUser(req,res){

    if(req.user){
        res.status(200).json({"check":true});
    }
    else{
        res.status(200).json({"check":false});
    }

}

export async function getUser(req,res){

    if(!req.user)
    {
        return res.status(401).json({message:{}});
    }
    return res.status(200).json({message:req.user});
}