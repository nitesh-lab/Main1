import axios from "axios";
import { data } from "../UI/HOME/PastUser";
import supabase from "./sbclient";
import { Data } from "../pages/Signup";
import useAxiosPrivate, { axiosPrivate } from "../hooks/useAxios";


export default async function userData(){

const { data: User, error } = await supabase
.from('User')
.select('Url,Name,Info').limit(1);
        
    if(error){
        throw new Error(error.message);
    }
   
    
    return User;
}

export async function getRandom():Promise<data[]>{

    const { data: User, error } = await supabase
    .from('User')
    .select("*")

    if(error){
        throw new Error("error h getRandom m")
    }
    
    

        return User;
}

export async function Signup(data: Data) {
    
    const { Name, email, password, profilePhoto: avatar } = data;
  
    try {
      const formData = new FormData();
      formData.append('Name', Name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('avatar', avatar[0]);  // Use the first item in the FileList
  
      const res = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        body: formData,
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
  
      const responseJson = await res.json();
      
  
      // Handle successful response or redirect if necessary
    } catch (e) {
      console.error('Error:', e);
      // Handle error appropriately (e.g., display an error message)
    }
  }
  
  interface login{
    email:string,
    password:string,
  }

    export async function Login(d:login){

      const {email,password}=d;
       
       const res=await axios.post("http://localhost:3000/user/login",{
            email,password
        },{
            headers:{"Content-Type":"application/json"}
        })
       
        
       return res.data.accessToken;
    }

    export async function getUser(auth,axiosPrivate){
 
      try{
     const res=await axiosPrivate.get("/user/getUser");
   
     return res.data;
    }
      catch(e){
       if(e.response.status==401){
        return e.response.data.message;
       }
      }
    }


    