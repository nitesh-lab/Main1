import mongoose from "mongoose";

const ChatSchema=new mongoose.Schema({
    Name:{type:String},
    avatar:{type:String},
    time:{type:String},
    message:{type:String},
    Mid:{type:String,default:"-1"},
    Users:[{type:mongoose.Schema.Types.ObjectId}],
},
{
    timestamps:true
})

 const MessageSchema=new mongoose.Schema({  
    Channel_id:{type:mongoose.Schema.Types.ObjectId},
    AllMessage:[{type:ChatSchema}],
}, 
{
    timestamps:true,
}
);

export const Message=mongoose.model("Message",MessageSchema);