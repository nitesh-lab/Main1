import { useState } from "react";
import { useForm } from "react-hook-form";
import useAxiosPrivate from "../hooks/useAxios";
import { CreateChannel } from "../services/Channel";
import { useQueryClient } from "@tanstack/react-query";
import { FaTimes } from 'react-icons/fa'; // Import the cross icon

export default function CreateRoom({ setCreate }) {
    const queryClient = useQueryClient();
    const { axiosPrivate } = useAxiosPrivate();
    const { register, handleSubmit } = useForm();
    const [selectedFile, setSelectedFile] = useState(null); // State to store the selected file

    async function Submit(data) {
        const { name } = data;
        const photo = selectedFile; // Use the selected file

        try {
            const res = await CreateChannel(name,axiosPrivate,selectedFile); // Update CreateChannel to accept the photo parameter

            await queryClient.invalidateQueries({ queryKey: ["channels"] });
        
        } catch (error) {
            console.error("Error creating channel:", error.message);
            // Display an error message to the user or perform other actions as needed
        } finally {
            setCreate((s: boolean) => !s);
        }
    }

    // Function to handle clicking the back button
    function handleBack() {
        setCreate((s: boolean) => !s);
    }

    // Function to handle file selection
    function handleFileChange(event) {
        setSelectedFile(event.target.files[0]); // Set the selected file in state
    }

    return (
        <div className="flex justify-center items-center h-full">
            <div className="bg-blue-500 p-4 rounded-lg shadow-lg">
                <form onSubmit={handleSubmit(Submit)}>
                    <div className="mb-4 flex justify-between items-center">
                        <label className="block text-white font-bold mb-2" htmlFor="name">
                            Room Name
                        </label>
                        <button onClick={handleBack} className="text-white"><FaTimes /></button>
                    </div>
                    <input
                        className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-4"
                        id="name"
                        type="text"
                        {...register("name", { required: true })}
                        placeholder="Enter Room Name"
                    />
                    <div className="mb-4 flex justify-between items-center">
                        <label className="block text-white font-bold mb-2" htmlFor="photo">
                            Group Photo
                        </label>
                        {/* Custom file input */}
                        <div className="relative">
                            <input
                                type="file"
                                id="photo"
                                className="absolute opacity-0 w-full h-full"
                                onChange={handleFileChange}
                            />
                            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                                {selectedFile ? selectedFile.name : "Choose File"}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            className="bg-green-500 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
