import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Message } from "../model/Message.model.js";
import { Channel } from "../model/Channel.model.js";
import { emitter } from "../controllers/Channel.controller.js";
import { User } from "../model/User.model.js";
import {v4 as uuid4} from "uuid";


export function ConnectSocket(server){

    let flag=false;

    const io=new Server(server,{cors:{
    origin:"http://localhost:5173",
    credentials:true,
} } );

const map=new Map();

const user_room=new Map();  //heapallocate

const handleJoin=(room_name,Link)=>{
    console.log("leave emitter ka handleJoin");
    io.to(room_name).emit("joined",{refetch:true,Link});
}

const handleLeave=(Link,name)=>{
    console.log("emitter running")
    io.to(name).emit("leftroom",{Link});
}

if(!flag){
flag=true;
emitter.on("userJoined",handleJoin);
emitter.on("leaveroom",handleLeave);
}


io.on("connection",(socket)=>{

    const utoken=socket.handshake.headers.authorization;

    map.set(socket.id,utoken); // id k sath user ki token associate krna taaki pata chale disconnect k time p
                             //konsa user jaarha h and then uss entryko delete krdo map s
    
    socket.on("join_room", async (d) => {
          
         socket.join(d.Name);
           
        let check=false;
           
        if(user_room.has(socket.id)){
                
                const obj=user_room.get(socket.id) // yaha socket id ki   


            //obj=user_room.get("user")   obj-> [{"nitu",link:2333},{name:"popat",link:235} ];

                console.log(user_room.get(socket.id));
               
                for(let i of obj){
                    console.log(i);
                }

                if(obj){
                    let flag=false;

                    for(let i of obj){
                    if((i.name==d.Name)){
                      flag=true;
                    }
                }
                 !flag && user_room.get(socket.id).push({Name:d.Name,Link:d.Link})
            }
    }
        else{
            user_room.set(socket.id,[{Name:d.Name,Link:d.Link}]);
        }

        const user=jwt.verify(d.token,process.env.ACCESS_TOKEN_SECRET)
         
        const Ch=await Channel.findOne({Link:d.Link}).select("_id");
            
        await User.findOneAndUpdate(
            { $and:[ {_id: user._id},{"Channel_id.Channels":Ch._id}] },
            { $set: {"Channel_id.$.isActive": true } },  
        );
        
        io.to(d.Name).emit("user_active",d.Link);
        
        });
        
        socket.on("newMessage",async(d)=>{

        const {link,selectedChannel,token,inputValue}=d;

        const decodedtoken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

        const Mid=`Message/${uuid4()}`; // build a unique identifier for every message.
        const {Name,avatar,_id}=decodedtoken;
        const ch=await Channel.findOne({Link:link}); // channel find kiya .
        const channel=await Message.findOne({Channel_id:ch._id}); // message m channel_id field s channel ki id find kari.
        //yaha p channel = message doc jaha channel_id h  particular channel k messages
          
        //find online/offline users from the selected channel.
      
   const result=await 
   Channel.aggregate([{
    $match:{
   "Link": link  // find channel in Channel doc
  },
  },
  {
    $unwind:"$Users"  //sabhi users ko separate karo jo channel m h
  },
  {
   $lookup: {
     from: "users",
     localField: "Users.User",  // sabhi users ke docs ko open karo
     foreignField: "_id",
     as: "result"
   },
  },
 {
   $addFields: {
     Res:{$first:"$result"}
   }
 },
 {
   $project:{
     Res:1,
   }
 },
 {
   $unwind:"$Res.Channel_id",// abb users k docs m ek user kitne channel m h un sab channel ko unwind karo
 },
 {
   $match:{
     "Res.Channel_id.Channels":ch._id,
   } 
 },
 {
   $group: {
     _id: "$Res.isActive",
     UserCount:{$sum:1},
     Users:{$push:"$Res.Channel_id.Channels"}
   }
 }
 ]);

 console.log("users=");
 console.log(result);

 let Activeusers=[];
 let InActiveusers=[];

 if(result.length==1){
if(result[0]._id==true){
    Activeusers=result[0];
 }
 else{
    InActiveusers=result[0];
 }
 }
 
 else{
    if(result[1]._id==true){
    Activeusers=result[1];
    InActiveusers=result[0];
}
else{
    Activeusers=result[0];
    InActiveusers=result[1];
}
 }

await User.updateMany(
    {
        $and:[
            { _id: { $in:InActiveusers?.Users } },  // Condition 1
            { "Channel_id.Channels": ch._id },   // Condition 2
            { "Channel_id.Mid": "-1" }          // Condition 3
        ]
    },
    {
        $set: {
            "Channel_id.$.Mid": Mid,  // Updating the 'Mid' field within the matching array element
        }
    },
);

await User.updateMany(
    {  $and:[ {_id: { $in: InActiveusers.Users } },{"Channel_id.Channels":ch._id} ] },
    {
        $inc: {
            "Channel_id.$.Notification": 1,
        }
    },
   
);

 if (!channel) {  //result[0]->inactive users result[1]->active users
    // Channel doesn't exist, create a new message document
   
    await Message.create({
        Channel_id: ch._id,
        AllMessage: [{
            Name,
            avatar,
            Mid,
            time: new Date().toLocaleString(),
            message: inputValue,
            Users: Activeusers.Users,
        }]
    });
} else {
    // Channel exists, push the new message into the existing document
    await Message.updateOne(
        { Channel_id: ch._id },
        { $push: { AllMessage: { Name, avatar, Mid, time: new Date().toLocaleString(), message: inputValue, Users: Activeusers.Users } } }
    );
}
    return io.to(selectedChannel).emit("currentMessage",{Name,avatar,message:inputValue,time:new Date().toLocaleString()});
    
})

    socket.on("newUser",async(m)=>{          
       
       const {link,channel:ch}=m;
      
        if(!link){
            return null;
        }

        const channel=await Channel.findOne({Link:link});
        //console.log(channel);
        //har ek user k saath associate kr sakte ho kitne dekh lie.

        const messages=await Message.find({Channel_id:channel._id}).select("AllMessage").limit(10); //
         
        if(messages.length>0 && messages[0].message){
            io.to(ch).emit("newUser",messages[0].message); 
        }   

        else{
            return null;
        }
    })

    socket.on("leaveRoom",async(m)=>{
        
       const ch=await Channel.find({Link:m}).select("Name");
  
       let room=io.sockets.adapter.rooms;
        
       room.forEach((val,name)=>{
        console.log(val);
        console.log("name="+typeof(name)+name);
       })

       let res=socket.rooms.has(ch[0].Name);
      
       socket.leave(ch[0].Name);

    })

    socket.on("disconnect",async()=>{
         
       let disconnectedtoken=map.get(socket.id);
       
       disconnectedtoken=disconnectedtoken.split(" ")[1];
       
       if(disconnectedtoken){
      
       map.delete(socket.id);

        const user_id=jwt.verify(disconnectedtoken,process.env.ACCESS_TOKEN_SECRET);
        
        const user=await User.findOne({_id:user_id._id});

        for(let i=0;i<user.Channel_id.length;i++)
        {
            user.Channel_id[i].isActive=false;
        }
        await user.save();
  
        user_room.get(socket.id)?.map((e)=>{
            io.to(e).emit("offline");
        })
        console.log("user_room before"+user_room);
        user_room.delete(socket.id);
        console.log("user_room after"+user_room);
    }
    })

    socket.on("typing",async(m)=>{
        const {Name,auth}=m;

        const t=jwt.verify(auth,process.env.ACCESS_TOKEN_SECRET)

        const user=await User.findOne({_id:t._id});

        io.to(Name).emit("typing",{Name:user.Name});
    });

    socket.on("typingStopped",async(m)=>{ //d daalde end m
        const {Name,auth}=m;

            const t=jwt.verify(auth,process.env.ACCESS_TOKEN_SECRET)

               const user=await User.findOne({_id:t._id});

        io.to(Name).emit("typingPause",{Name:user.Name});
    })


    socket.on("MessageSeen", async (m) => {
       
        try {
            const { Link,token} = m;
           
           const Ch=await Channel.findOne({Link}).select("_id");

          const user=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);

            const channel=await Message.findOne({ Channel_id:Ch._id});
    
            if (!channel) {
                console.log("Channel has empty message");
                return;
            }
    
            // Loop over only the top 10 messages
            for (let i = 0; i < Math.min(10,channel.AllMessage.length); i++) {
               
                const message=channel.AllMessage[i];
               
                const userExists = message.Users.some(obj => obj.User === user._id);
               
                if (!userExists) {
                    message.Users.push(user._id );  
                }
                await channel.save();
            }
                    //jis point p usne dekhna band kiya waha s leke aa
        } catch (error) {
            console.error("Error:", error);
        }
    });
    
})

process.on("SIGINT",()=>{
    process.exit();
 })

 process.on("exit",()=>{
      console.log("exiting");
      emitter.removeAllListeners();
 })

process.on("warning",e=>console.log(e.stack))
 

}

 
