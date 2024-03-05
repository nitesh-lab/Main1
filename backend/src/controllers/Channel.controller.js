import { Channel } from "../model/Channel.model.js";
import { User } from "../model/User.model.js";
import {EventEmitter} from "events";
import UploadonCloudinary from "../utils/uploadCloudinary.js";

export let emitter=new EventEmitter();

export async function getAllChannel(req,res){
 
  console.log("user id=")
  console.log(req.user._id);

 const data=await User.aggregate(
    [{
      $match: {
       _id:req.user._id,
      },
    },
     {
       $unwind:"$Channel_id",
     },
     {
       $lookup: {
         from: "channels",
         localField: "Channel_id.Channels",
         foreignField: "_id",
         as: "result"
       }
     },
     {
       $group:{
         _id:"null",
       Channel_id:{$push:"$result"}
       }
     } 
    ]
  )

console.log(data);

      const result=data &&  data[0]?.Channel_id?.map((channel) => {
      
        if(channel.length<1){
          return [];
        }

       if(channel[0]){
        return {
        name: channel[0]?.Name,
        link: channel[0]?.Link,}
        }
      });

      console.log(result);
 
    return res.status(200).json({"channel":result && result[0] ? result :[]});
}

export async function CreateChannel(req,res){

  const {name,selectedChannel}=req.body;

  const Link=req.query.Link;

  console.log("linkk="+req.query.Link);
  
  const uploadfile=await UploadonCloudinary(req.file.path);
  console.log("create p aaya m")
  
  const user_id=req.user._id;

  const result=await Channel.create({Name:name,Link,GroupPhoto:uploadfile.url,Users:[{User:user_id,isAdmin:true}]});

  const user=req.user;

  console.log("req.file="+req.file);
  

  user.Channel_id.push({Channels:result._id,Notification:0}); // Push the new channel ID into the existing array

  await user.save({ validatebefore: false }); // Save the updated user document
  
  return res.status(201).json({"message":result});
}


export async function getSingleChannel(req,res){

   const {link}=req.body;

   const user=req.user;

  const size=await Channel.aggregate(
      [
        {
          $match:{
            Link:link,
          },
        },

        { 
          $project:{ Usercount: {$size:"$Users"},Name:1,GroupPhoto:1},
        }
      ]
    );

      const isAdmin=await Channel.aggregate( 
      [	{
        $match:{
        Link:link,
        },
      },
       {
         $unwind:"$Users"
       },
         {
           $group: {
             _id:"$Users.isAdmin",
           "userid":{$push:"$Users"}
           }
         }
       
      ] )
      let isCheck=false;
      
     isAdmin.map((e)=>{
      if(e._id==true){
       
       if(e.userid[0].User.equals(user._id)){
        isCheck=true;
       }
      }
     })
     console.log("single running");
     const Ch=await Channel.findOne({Link:link}).select("_id");
  

  await User.updateMany(
   { _id: user._id },
   {
    $set: { "Channel_id.$[elem].isActive": false }
   },
  {
    arrayFilters: [{ "elem.isActive": true }]
  }
  );

        await User.updateMany(
           {_id:user._id},
          {
            $set:{"Channel_id.$[elem].isActive":true}
          },
          {
            arrayFilters:[{"elem.Channels":Ch._id}]
          })

         
          return res.status(200).json({"data":size[0],"isAdmin":isCheck});

        }

export async function joinChannel(req,res){

  const {link}=req.body;
 
  const user=req.user;

  const channel=await Channel.findOne({Link:link});
  //console.log(channel);

  if(!channel){
    return res.status(400).json({"message":"wrong link"});
  }

  await Channel.updateOne({Link:link},{$push:{Users:{User:user._id,isAdmin:false}}});
 
  //Channel_id:[{Channels:{type:mongoose.Schema.Types.ObjectId,ref:"Channel"},Notification:{type:Number,default:0}}]
  //console.log(user._id);
  //console.log(channel._id);
  await User.updateOne({_id:user._id},{$push:{Channel_id:{Channels:channel._id,Notification:0} }});

  if(!channel){
   return res.status(404).json({"message":"No such Channel"});
  }

  emitter.emit("userJoined",channel.Name,link);
 
 return res.status(200).json({"message":"done"});
  //console.log("done");
}


export async function leaveroom(req, res) {
  try {
    
    const { _id: user_id } = req.user;
    const { Link } = req.body;
    
      const ch_id = await Channel.findOne({ Link }).select("_id Name");

   const user= await User.findOneAndUpdate({_id:user_id}, { $pull: { Channel_id: ch_id._id } },{multi:true},{new:true});
   
   const channel = await Channel.findByIdAndUpdate(ch_id._id ,
    { $pull: { Users:{ User: user_id }  } },
    { new: true }
);

    console.log(channel)

    let name=ch_id.Name;

      emitter.emit("leaveroom",Link,name);

    return res.status(200).json({ message: "User left the channel successfully." });
  }
   catch (error) {
    console.error("Error occurred while leaving the channel:", error);
    return res.status(500).json({ error: "An error occurred while leaving the channel." });
  }
}

export async function GetAllUsers(req,res){

  const {Link}=req.body;

 // console.log("link="+Link);

   const allUsers=await Channel.aggregate(
    [{
      $match: {
    Link:Link,
      }
    },
     {
       $unwind:"$Users"
     }
      ,
     {
       $lookup: {
         from: "users",
         localField: "Users.User",
         foreignField: "_id",
         as: "result"
       }
     },
     {
       $group:{
       _id:null,
      result:{$push:"$result"}
       }
      }
    ]
    );
     
      console.log("allUsers=")
      console.log(allUsers[0].result)

      let ans=[];
     
        allUsers[0].result.map((e)=>{
         ans.push({"isActive":e[0].isActive,"avatar":e[0].avatar,"Name":e[0].Name,"lastSeen":e[0].lastSeen});
        });
        console.log(ans);
      return res.status(200).json({"data":ans});
  }