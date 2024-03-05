import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import useAxiosPrivate from "../hooks/useAxios";
import { JoinChannelUser } from "../services/Channel";
import { useQueryClient } from "@tanstack/react-query";

export default function Joinroom({setJoin,setJoinChannelUser}){

    const queryClient=useQueryClient();
    const { register, handleSubmit } = useForm();
    const {axiosPrivate}=useAxiosPrivate();
    
     function Submit(data) {
    
      const { link } = data;
       
       JoinChannelUser(axiosPrivate,link)
       .then((d)=>{
        queryClient.invalidateQueries(["channels"])
        .then((d)=>{
           
        })
       })
       .catch((e)=>{
        throw new Error(e)
       })
       .finally(()=>{
            setJoinChannelUser(true);
            setJoin((s)=>!s)
            
    })
    }

    function handleBack(){
        setJoin((s)=>!s)
    }

    return (
        <div className="flex justify-center items-center h-full">
            <div className="bg-blue-500 p-4 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit(Submit)}>
                    <div className="mb-4 flex justify-between items-center">
                        <label className="block text-white font-bold mb-2" htmlFor="name">
                            Invite Link
                        </label>
                        <button onClick={handleBack} className="text-white"><FaTimes /></button>
                    </div>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="link"
                        type="text"
                        {...register("link", { required: true })}
                    />
                    <div className="flex justify-end mt-4">
                        <button
                            className="bg-green-500 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Join
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}