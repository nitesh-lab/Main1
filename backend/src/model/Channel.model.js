import mongoose from "mongoose";

const ChannelSchema=new mongoose.Schema({
    
    Name:{
       type:String,
        },
    Users: [{User:{type:mongoose.Schema.Types.ObjectId,ref:"User"},isAdmin:{type:Boolean}}],
     
    Link:{
        type:String,
        unique:true,
    },
    GroupPhoto:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
    }
},   
{
timestamps:true,
})

export const Channel=mongoose.model("Channel",ChannelSchema);
