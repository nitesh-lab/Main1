import mongoose from "mongoose";
import { DB_NAME } from "../const/db.js";

    export async function ConnectDB(){
      try{
        const obj=await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`,{
          useNewUrlParser: true,
          useUnifiedTopology: true,
          w: 'majority', // Set your desired write concern here
          wtimeout: 2500, // 
        });
        console.log(obj.connection.host);
        console.log(`${process.env.MONGODB_URI}/${DB_NAME}`)
    }
      catch(error){
        console.log(error);
        process.exit(1);
      }
    }


