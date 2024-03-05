
function Message({ message }) {

    const {time}=message;
      
   const t=time.split(",");
  
    return (
    <div className="flex items-start mx-[5px] sm:m-[10px] md:mx-[15px] lg:mx-[20px] rounded-full">
      <img src={message.avatar} alt="User Avatar" className=" w-5 h-5 sm:w-10 sm:h-10 h rounded-full mr-4" />
      <div className="flex-1">
        <div className="text-sm sm:text-lg text-purple-600 font-bold">{message.Name}</div>
        <div className="text-sm md:text-lg text-gray-300">{message.message}</div>
      </div>
      <div className="text-[8px] sm:text-sm  text-gray-400">
        <p >{t[0]}</p>
        <p>{t[1]}</p>
      </div>
    </div>
  );
}

export default Message;
