import { io } from "socket.io-client";

let token = undefined;

// Function to set the token


// Create Socket.IO instance with extraHeaders option
export const socket = io("http://localhost:3000", {
    withCredentials: true,
    autoConnect: false,
});

// Function to connect socket
export const socketConnect = (t) => {
    console.log(t);
    token=t;

    socket.io.opts.extraHeaders={
        Authorization:`Bearer ${token}`
    }
    socket.connect();
}
