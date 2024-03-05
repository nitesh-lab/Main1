import { useEffect } from "react";
import { socket } from "../../services/socket";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GetAllUsers } from "../../services/Channel";
import useAxiosPrivate from "../../hooks/useAxios";
import { FaTimes } from "react-icons/fa";
import { useChat } from "../../Context/Chatcontext";

export default function UserList({ Link }) {
  const { dispatch } = useChat();
  const { axiosPrivate } = useAxiosPrivate();
  const queryClient = useQueryClient();

  const { data: usersData, isLoading, refetch } = useQuery({
    queryKey: ["Users", Link],
    queryFn: () => GetAllUsers(axiosPrivate, Link),
  });

  useEffect(() => {
    async function invalidate() {
      socket.on("offline", async () => {
        await queryClient.invalidateQueries({ queryKey: ["Users", Link] });
      });
    }
    invalidate();

    return () => {
      socket.off("offline");
    };
  }, [queryClient, Link]);

  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <div className="bg-gray-800 p-4 rounded shadow-md min-h-[100vh]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-700">Room Members:</h2>
        <FaTimes color="white" onClick={() => dispatch({ type: "HideAllUsers" })} />
      </div>
      <ul>
        {usersData && usersData.data && usersData.data.length > 0 ? (
          usersData.data.map((user, index) => (
            <li key={index} className="flex items-center mb-4">
              <img src={user.avatar} className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full mr-2" alt="Profile" />
              <div>
                <span className="text-white text-sm mr-[10px] sm:mr-[30px] md:mr-[40px] lg:mr-[50px] sm:text-base md:text-lg lg:text-xl">{user.Name}</span>
                {user.isActive ? (
                  <span className="text-green-500 text-sm sm:text-base mr-[5px] md:text-lg lg:text-xl">Online</span>
                ) : (
                  <span className="text-red-500 text-sm sm:text-base md:text-lg mr-[5px] lg:text-xl">{user.lastSeen}</span>
                )}
              </div>
            </li>
          ))
        ) : (
          <li className="text-red-500">No users found</li>
        )}
      </ul>
    </div>
  );
}
