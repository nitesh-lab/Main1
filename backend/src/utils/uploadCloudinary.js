import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARYNAME, 
    api_key: process.env.CLOUDINARYKEY, 
    api_secret: process.env.CLOUDINARYSECRET 
  }); 

  export default async function UploadonCloudinary(path){
    try{
    const response=await cloudinary.uploader.upload(path,{
    resource_type:"auto",
   });
   
    fs.unlinkSync(path); 

    return response;
}
    catch(e){
      console.log(e);
        fs.unlinkSync(path);
        return null;
    }
  }