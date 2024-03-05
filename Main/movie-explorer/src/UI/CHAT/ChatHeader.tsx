import {  useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import DropdownComponent from "./DropDown";
import { useChat } from "../../Context/Chatcontext";
import { socket } from "../../services/socket";

export default function ChatHeader({ data, setShowLink, setConfirm, Link }) {
  const queryClient = useQueryClient();
  
      const {dispatch,isTyping}=useChat();

  const d = queryClient.getQueryData([`${Link}`]);

  const [openUserList, setUserList] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [name,setName]=useState("");
  // const { axiosPrivate } = useAxiosPrivate();

  // const { data: users, isLoading, refetch } = useQuery({
  //   queryKey: ["Users", Link],
  //   queryFn: () => GetAllUsers(axiosPrivate, Link),
  // });

  useEffect(()=>{
    socket.on("typing",(m)=>{
      dispatch({type:"typing"});
      setName(m.Name);
    })
    
    socket.on("typingPause",(m)=>{
      dispatch({type:"typingPause"})
      setName(m.Name);
    })

    return ()=>{
      socket.off("typing");
      socket.off("typingPause");
    }
  },[dispatch,name])

  function handleInvite(e) {
    e.stopPropagation();
    setShowLink(true);
  }

  function handleLeaveChannel(e) {
    e.stopPropagation();
    setConfirm(true);
  }

  async function ShowUser() {
    setUserList(true);
  }

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex items-center">
      {/* Group photo */}
      <img
        src={data?.GroupPhoto}
        className="w-[40px] h-[25px] sm:w-[60px] sm:h-[30px] md:w-[75px] md:h-[40px] rounded-full mt-[2px] sm:mt-[5px]"
      />

      {/* Group details */}
      <div className="ml-3 flex flex-col">
        <h1 className="text-xl font-bold text-purple-600">{data?.Name}</h1>
        <p className="text-sm text-gray-300">{data?.Usercount} members</p>
      {isTyping ?<p>{name && name}...typing</p>:null}
      </div>

      {/* Buttons */}
      <div className="flex gap-[3px] sm:gap-[8px] md:gap-[13px] ml-auto">
        {d.isAdmin && (
          <button
            type="button"
            className="p-2 sm:p-3 md:p-4 w-10 sm:w-12 md:w-14 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={(e) => toggleDropdown(e)}
          >
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full mx-1"></div>
            <div className="w-3 h-3 bg-gray-600 rounded-full"></div>
          </button>
        )}
        <button
          className="bg-red-500 text-white p-[4px] sm:p-[6px] md:p-[8px] rounded"
          onClick={(e) => handleLeaveChannel(e)}
        >
          Leave
        </button>
        <button
          className="bg-blue-500 text-white px-[4px] py-[4px] sm:p-2 md:p-3 rounded"
          onClick={(e) => handleInvite(e)}
        >
          Invite
        </button>
      </div>

      {/* Dropdown */}
      <div className="ml-3">
        <DropdownComponent isOpen={isOpen} />
      </div>
    </div>
  );
}
