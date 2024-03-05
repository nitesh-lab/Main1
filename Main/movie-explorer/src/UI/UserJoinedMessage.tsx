import React, { useEffect, useState } from "react";

interface Props {
  user: string; // User name or identifier
}

function UserJoinedMessage ({ user }){
    
  const [isVisible, setIsVisible] = useState(true);

  // Automatically hide the component after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 5000); // 5000 milliseconds = 5 seconds

    // Clean up the timer when the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isVisible && user && (
        <div className="text-gray-600 text-center mt-2">
          <span className="font-bold">{user}</span> joined the chat
        </div>
      )}
    </>
  );
}

export default UserJoinedMessage;
