import axios from "axios";
import { useAuth } from "../Context/Auth";
import { useEffect } from "react";

export const axiosPrivate=axios.create({
    baseURL:"http://localhost:3000",
    withCredentials:true,
});


export default function useAxiosPrivate(){

    const {auth}=useAuth();

    useEffect(()=>{

        console.log("effect runs");

const reqintercept=axiosPrivate.interceptors.request.use(

        function (config){
            if(!config.headers.Authorization){
        config.headers.Authorization=`Bearer ${auth}`
        }
        return config;
    },
    (e)=>{
        console.log("2 trigger");
        return Promise.reject(e)   
})

const resintercept=axiosPrivate.interceptors.response.use(

    function(response){
        return response;
    },
    async function(error){

        const check=error.config;

     if(error.config.status==403 && !check?.sent ){

        check.sent=true;

        const refresh=await axios.get("http://localhost:3000/user/refresh");

        error.config.headers['Authorization']=`Bearer ${refresh.data.token}`;

        return axiosPrivate(error.config);
     }
        return Promise.reject(error)
    }
)

    return ()=>{
        axiosPrivate.interceptors.request.eject(reqintercept);
        axiosPrivate.interceptors.response.eject(resintercept);
    }
    },[auth])

    return {axiosPrivate};
}