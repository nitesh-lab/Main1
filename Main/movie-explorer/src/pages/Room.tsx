import { useEffect, useState } from "react";
//import { socket } from "../services/socket";
import Chat from "../UI/CHAT/Chat";
import { FaBars, FaTimes } from 'react-icons/fa';
import { useQuery } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { getChannels } from "../services/Channel";
import { v4 as uuidv4 } from 'uuid';
import ChannelList from "../UI/ChannelList";
import { useAuth } from "../Context/Auth";
import CreateRoom from "../UI/CreateRoom";
import Display from "../UI/Display";
import Joinroom from "../UI/Joinroom";
import ChatContext from "../Context/Chatcontext";
import { socket, socketConnect } from "../services/socket";


interface obj {
  ChannelName: string[],
  TotalChannels:number,
}




export default function Room() {

  console.log("room renderd");

  const { auth } = useAuth();
  const nav = useNavigate();
  const { axiosPrivate } = useAxiosPrivate();
  const [isOpen, setIsOpen] = useState(false);
  const [create, setCreate] = useState(false);
  const [isChannelOpen,setChannelOpen]=useState(false);
  const [selectedChannel,setSelectedChannel]=useState("");
  const [Servermessage, setServerMessage] = useState([]);
  const [join,setJoin]=useState(false);
  const [showLink, setShowLink] = useState(false);
  const [JoinChannelUser,setJoinChannelUser]=useState(false);
  const [confirm,setConfirm]=useState(false);
  const [isDelete,setDelete]=useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["channels",JoinChannelUser,isDelete],
    queryFn: () => getChannels(axiosPrivate),
    staleTime: 60*1000*5,
  });

  useEffect(() => {
  
    socketConnect(auth);
   return () => {
      socket.disconnect();
    };
  }, [auth]);

  function handleCreateRoom() {
    setCreate((s) => !s);
  }

  function handleJoinRoom() {
    setJoin((s)=>!s);
  }

  if(!auth){
    nav("/login");
    return null;
  } 

  console.log(data);

  return (
    <>
      <div className="flex justify-center items-center bg-blue-800 h-[20px] sm:h-[30px] md:h-[40px] lg-[50px] text-white font-bold uppercase">Discord</div>
      {isOpen ? (
        <div className="grid grid-cols-7 grid-rows-[100vh] w-[100vw] relative">
          <div className="col-start-1 col-end-3 row-start-1 row-end-2 sm:col-end-2 bg-gray-800 flex flex-col">
            <button onClick={() => setIsOpen((s) => !s)} className="m-[5px] inline-block"><FaTimes color="white" onClick={()=>setChannelOpen(false)} /></button>
            <button onClick={handleCreateRoom} className=" p-[3px] bg-green-500 text-white rounded-lg m-[2px]">Create Room</button>
            <button onClick={handleJoinRoom} className="p-[3px] bg-blue-500 text-white rounded-lg mt-2 sm:mt-[10px] md:mt-[15px]">Join Room</button>
            <div className="mt-[8px] md:mt-[20px] lg:mt-[30px] ">
             <p className="m-[2px] text-white sm:m-[8px] md:m-[12px] lg:m-[14px]">Total Channels: {data && data?.channel[0]?.TotalChannels}</p>
              {data && data?.channel?.map((e) => {
                return <ChannelList key={uuidv4()} name={e.name} setSelectedChannel={setSelectedChannel} setChannel={setChannelOpen} setServerMessage={setServerMessage} uniqueKey={e.link}  setShowLink={setShowLink} selectedChannel={selectedChannel} />
              })}
            </div>
          </div>
          <div className="col-start-3 col-end-8 row-start-1 row-end-2 sm:col-start-2 bg-white">
            {create && <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md flex justify-center items-center"><CreateRoom setCreate={setCreate} /></div>}
            {join && <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-filter backdrop-blur-md flex justify-center items-center"><Joinroom setJoin={setJoin} setJoinChannelUser={setJoinChannelUser} /></div>}
            {!isChannelOpen ? <Display/> :<ChatContext><Chat selectedChannel={selectedChannel} setServerMessage={setServerMessage} Servermessage={Servermessage}  showLink={showLink}  setShowLink={setShowLink}  confirm={confirm} setConfirm={setConfirm} setDelete={setDelete} setChannelOpen={setChannelOpen} /></ChatContext>}
          </div>
        </div>
      ) : (
          <>
            <div>
              <button onClick={() => setIsOpen((s) => !s)} className="bg-gray-600 p-[5px] sm:p-[10px] inline-block" > <FaBars color="white" /> </button>
            </div>
            <div className="h-[100vh]">
            {!isChannelOpen? <Display/> :<ChatContext><Chat selectedChannel={selectedChannel} setServerMessage={setServerMessage} Servermessage={Servermessage}  showLink={showLink}  setShowLink={setShowLink} confirm={confirm} setConfirm={setConfirm} setDelete={setDelete} setChannelOpen={setChannelOpen}/></ChatContext>}
            </div>
          </>
        )}
    </>
  );
}
