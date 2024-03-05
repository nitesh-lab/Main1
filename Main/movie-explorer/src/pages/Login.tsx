import { useMutation } from "@tanstack/react-query";
import {  useForm } from "react-hook-form";
import { Login } from "../services/userData";
import { useNavigate} from "react-router-dom";
import { useAuth } from "../Context/Auth";
import axios from "axios";


function LoginComponent() {
 
    const {setAuth}=useAuth();

    type data={
        email:string,
        password:string
    }

    const nav=useNavigate();
      
    const {mutate:Log}=useMutation({

      mutationFn:(d:data)=>Login(d),
      onSuccess:(d)=>{
        setAuth(d);
        nav("/main");  // navigating to room component for check
      },
      onError:(e)=>{
        throw new Error(e); 
      }
    });
  
    const {register,handleSubmit,reset,formState}=useForm<data>();

    function Submit(data:data){
       Log(data);
        reset();
    }

    const {errors}=formState;

    function OnError(e){
    console.log(e);
       
    }

    function handleAdmin(data:data){
     
    axios.post("http://localhost:3000/admin",data)
    .then((d)=>{
      console.log(d);
      nav("/admin")
    })
    .catch((e)=>{
      if(e.response.status=="401"){
        nav("/login")
      }
    })
    }

  return (
    <>
    <div className="container mx-auto p-4 max-w-md bg-black">
      <form className="bg-black shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(Submit,OnError)}>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2"  htmlFor="email">
            Email
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline ${errors.email?
            "border-red-500":""}   `}
            id="email"
            type="email"
            placeholder="Your Email"
            {...register("email",{required:"Required field" })}
          />
          {errors.email && <p>{errors.email.message}</p>}
        
        </div>
        <div className="mb-6">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            className={`shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline
            ${errors.password?"border-red-500":""}`}
            id="password"
            type="password"
            placeholder="Your Password"
            {...register("password",{required:"Required field",validate:(val:string)=>{
               
                if(val.length<7){
                    return "Please Enter 8 Digit Password"
                }
 } })}
          />
          {errors.password && (
              <p className="text-red-500 text-xs italic">{errors.password.message}</p>
            )}
        </div>
        <div className="flex items-center justify-between">
          <button type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Login
          </button>
 
          <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"  onClick={handleSubmit(handleAdmin)} 
            >
            Login as Admin
          </button>
        </div>
      </form>
    </div> 
    </>
  );
}


export default LoginComponent;
