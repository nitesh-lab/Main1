import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const AdminSchema=new mongoose.Schema({

    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    refreshToken:{
        type:String,
    }
})

    AdminSchema.pre("save",async function(next){

        if(this.isModified("password")){
           this.password=await bcrypt.hash(this.password,10);
        }
        next();
    })

    AdminSchema.methods.isPasswordCorrect=async function(password){

       // console.log(password);
        //console.log(this.password);
       return await bcrypt.compare(password,this.password);        
    }

    AdminSchema.methods.generateAccessToken=async function(){

      return  jwt.sign({
            _id:this._id,
            email:this.email,
        },process.env.AdminRefreshTokenSecret,{expiresIn:process.env.ADMIN_ACCESS_TOKEN_EXPIRY});
    }

    AdminSchema.methods.generateRefreshToken=async function(){
       return jwt.sign({
            _id:this._id,
        },process.env.AdminRefreshTokenSecret,{expiresIn:process.env.AdminRefreshTokenExpiry});
    }

export const Admin=mongoose.model("Admin",AdminSchema);