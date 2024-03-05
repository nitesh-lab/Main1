import { useQueryClient } from '@tanstack/react-query';
import useAxiosPrivate from '../../hooks/useAxios';
import { useEffect, useState } from 'react';
import { socket } from '../../services/socket';

function Alert({ setConfirm,message,Link,setDelete,setChannelOpen,confirm }) {

  const [isleave,setisLeave]=useState(false);
 
  useEffect(()=>{
    console.log("aler effect trying to run");
    console.log("isleave="+isleave);
  
    return ()=>{
      console.log("alert cleanup running");
      socket.emit("leaveRoom",Link);
    }
    
  },[isleave,Link])

    const {axiosPrivate}=useAxiosPrivate();
    const queryClient=useQueryClient();

    async function  onConfirm() {
        try{
            const response=await axiosPrivate.post("/channel/leaveroom",{
                Link
            });
            await queryClient.invalidateQueries({queryKey:["channels"]});
        }
        catch(e){
            console.log(e)
        }
        finally{
            setConfirm(false); //changed
            setDelete(true);
            setChannelOpen(false);
            setisLeave(true);
        }
  }

  function onCancel() {
   setConfirm(false);
  }

  return (
    <div className="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center">
      <div className="fixed inset-0 transition-opacity  opacity-75"></div>
      <div className="relative bg-blue-500 rounded-lg max-w-md">
        <div className="flex justify-center items-center  p-5 rounded-t-lg ">
          <svg onClick={()=>onCancel()}  className="w-10 h-10 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          <h3 className="text-lg font-medium text-white ml-2">Confirm</h3>
        </div>
        <div className="p-5">
          <p className="text-sm text-gray-800">{message && message}</p>
        </div>
        <div className=" px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
          <button onClick={()=>onConfirm()} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
            Yes
          </button>
          <button onClick={()=>onCancel()} type="button" className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-gray-200 text-base font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default Alert;
