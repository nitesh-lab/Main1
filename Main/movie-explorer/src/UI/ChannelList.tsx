import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosPrivate from "../hooks/useAxios";
import { getSingleChannel } from "../services/Channel";

export default function ChannelList({ name, setChannel, uniqueKey,setSelectedChannel, setServerMessage,setShowLink,selectedChannel}: { name: string }) {
    
    const { axiosPrivate } = useAxiosPrivate();
 
    console.log("channellist rerendered");

    const queryClient = useQueryClient();

    const {refetch} = useQuery({
        queryKey: [uniqueKey],
        queryFn: () => getSingleChannel(uniqueKey, axiosPrivate),
        staleTime: 5 * 60 * 1000, // Data is considered stale after 5 minutes
    });

    async function handleClick() {
        setChannel(true);
        await refetch();
        setSelectedChannel(uniqueKey);
        if(selectedChannel!=uniqueKey){
        setServerMessage([]);    
        }
        setShowLink(false);
    }

    return (
        <button className="p-[3px] sm:p-[6px] md:p-[10px] text-white bg-gray-700 rounded-md shadow-md text-lg border border-white hover:bg-gray-800 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 w-[100%]"
            onClick={handleClick}>
            {name}
        </button>
    );
}
