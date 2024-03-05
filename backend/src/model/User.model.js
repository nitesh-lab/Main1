import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const UserSchema=new mongoose.Schema({

    Name:{
        type:String,
        required:true,   
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        required:true,
    },
    Channel_id:[{ Channels:{type:mongoose.Schema.Types.ObjectId,ref:"Channel"},Notification:{type:Number,default:0},Mid:{type:String,default:"-1"},isActive:{type:Boolean,default:false}}] //parcticular channel status
    ,
    isActive:{type:Boolean,default:false}, //overall status
    
    lastSeen:{type:String,default:"0"},

    refreshToken:{
        type:String,
    }
},{
    timestamps:true
})

    UserSchema.pre("save",async function(next){  // no this in arrow

        const user=this;

        if(user.isModified("password"))
        {
            this.password = await bcrypt.hash(this.password,10);
            next();
        }
        next();
    })

    UserSchema.methods.isPasswordCorrect=async function(pass){
       return await bcrypt.compare(pass,this.password);
    }
   
    UserSchema.methods.generateAccessToken=function(){
        return jwt.sign({
            _id:this._id,
            email:this.email,
            Name:this.Name,
            avatar:this.avatar,
        },process.env.ACCESS_TOKEN_SECRET,{
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
        )
    }


    UserSchema.methods.generateSecretToken=function(){
        return jwt.sign({
           _id:this._id, 
        },
        process.env.RefreshTokenSecret,{
            expiresIn:process.env.RefreshTokenExpiry
        })
    }


export const User=mongoose.model("User",UserSchema);