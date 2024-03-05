
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { socket } from '../../services/socket';
import { useAuth } from '../../Context/Auth';
import Message from './Message';
import Invite from './Invite';
import Alert from './Alert';
import ChatHeader from './ChatHeader';
import { useChat } from '../../Context/Chatcontext';

import UserList from "./UserList";
import Input from './Input';

function Chat({ selectedChannel, setServerMessage, Servermessage, showLink, setShowLink,confirm,setConfirm,setDelete,setChannelOpen}) {
  
  console.log("chat rendered");

  const { auth } = useAuth();

  const queryClient = useQueryClient();

  const [inputValue, setInputValue] = useState('');
  
  const {dispatch,join,data,showusers}=useChat();

  useEffect(() => {

    if (selectedChannel) {

      const fetchData = async () => {
        const d=await queryClient.getQueryData([selectedChannel]);
       
        //setData(d);
        dispatch({type:"data/update",payload:d});
       
        socket.emit("join_room", {Name:d?.data?.Name,token:auth,Link:selectedChannel});
       
        socket.emit("newUser", { link: selectedChannel, channel: d?.data?.Name ? d.data.Name : "" });

        socket.emit("MessageSeen",{Link:selectedChannel,token:auth});

        socket.on("newUser", (m) => {
          setServerMessage((s) => [...m]);
        });

        socket.on("currentMessage", (m) => {
          setServerMessage((s) => [...s, m]);
        });
      };
        socket.on("joined",async(m)=>{
          console.log(m.Link);
            console.log("m andar aarha hu")
            console.log(" m nahi aakya kya")
            await queryClient.invalidateQueries({queryKey: [`${m.Link}`]})
            // setJoin((s)=>!s);
          dispatch({type:"join"});
            })

            socket.on("user_active",async(m)=>{
              console.log("inactive p aaya m");
              console.log("m="+m);
              await queryClient.invalidateQueries({queryKey: ["Users",`${m}`]})
            });

        socket.on("leftroom",async(m)=>{
          console.log("leftroom running");
          await queryClient.invalidateQueries({queryKey:[`${m.Link}`]})
          await queryClient.invalidateQueries({queryKey:["Users",`${m.Link}`]})
          dispatch({type:"join"});
        })

      fetchData();
    }

    return () => {
      socket.off("currentMessage");
      socket.off("newUser");
      socket.off("joined");
      socket.off("leftroom");
      socket.off("user_active");
    };
  }, [selectedChannel, queryClient, setServerMessage,join,dispatch,auth]);

  function handleClick() {
    socket.emit("newMessage", { link: selectedChannel, selectedChannel: data?.Name, token: auth, inputValue });  
  }

 
  if (!selectedChannel) {
    return <p>loading</p>;
  }

  return !showusers ? <div className="flex flex-col flex-1 h-[100vh] bg-gray-900 text-white">
        <ChatHeader data={data} setConfirm={setConfirm} setShowLink={setShowLink} Link={selectedChannel} />
      {confirm && <Alert setConfirm={setConfirm} Link={selectedChannel} setDelete={setDelete} setChannelOpen={setChannelOpen} confirm={confirm} />}
      <div className="flex flex-col flex-1 p-4 overflow-y-auto">
        {showLink && <Invite link={selectedChannel} setShowLink={setShowLink} />}
        {Servermessage.map((e, index) => (
          <Message key={index} message={e} />
        ))}
      </div>

      <div className='flex gap-[10px] justify-center mb-[10px] sm:mb-[15px] md:mb-[20px]'>
        <Input inputValue={inputValue} setInputValue={setInputValue}/>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded ml-2" onClick={handleClick}>Send</button>
      </div>
      </div>
    :<UserList Link={selectedChannel}/>
          }
export default Chat;