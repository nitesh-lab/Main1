import { useCallback, useEffect, useState } from "react";
import { socket } from "../../services/socket";
import { useAuth } from "../../Context/Auth";
import { useChat } from "../../Context/Chatcontext";

export default function Input({ inputValue, setInputValue }) {
  const { auth } = useAuth();
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined);
  const { dispatch, InputEnter, data } = useChat();

//   const debounce = useCallback(
   
//     function debounce(delay) {

//         console.log("debounce rnning");
//       clearTimeout(timer && timer);
  
//       const t = setTimeout(() => {
//         console.log("timer aftr 3s emitiing");

//         socket.emit("typing", { auth: auth, Name: data?.Name });
//       }, delay);
//       setTimer(t);
//     },
//     [auth, data?.Name]
//   );

const debounce = useCallback(
    function debounce(delay) {
      console.log("debounce running");
      clearTimeout(timer);
      const t = setTimeout(() => {
        console.log("timer after 3s emitting");
        socket.emit("typing", { auth: auth, Name: data?.Name });
      }, delay);
      setTimer(prevTimer => {
        // Use functional update to avoid including setTimer in dependency array
        if (prevTimer) {
          clearTimeout(prevTimer);
        }
        return t;
      });
    },
    [auth, data?.Name] // Dependencies of debounce function
  );
  

  useEffect(() => {
    console.log("input running")
    if (InputEnter && inputValue.length > 0) {
      debounce(1000);
    } else if (!InputEnter && inputValue.length >= 0) {
        console.log("mouse left");
      socket.emit("typingStopped", { auth, Name: data?.Name });
    }
  }, [auth,InputEnter,inputValue, data?.Name, debounce]);

  useEffect(()=>{
    return () => {
        if (timer) {
          clearTimeout(timer); // Clear the timer on component unmount
        }
      };
  },[timer]);

  return (
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      placeholder="Type your message..."
      className="border border-gray-700 rounded p-2 w-1/4 text-black"
      onFocus={() => dispatch({ type: "InputEnter" })}
      onBlur={() => dispatch({ type: "InputLeave" })}
    />
  );
}
