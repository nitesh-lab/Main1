import { createContext, useContext, useReducer } from "react"

const Chatcontext=createContext();

    function reducer(state,action){

        switch(action.type){
        
            case "data/update":{
            return {...state,...action.payload};
        }
        case "join":{
            return {...state,join:!state.join};
        }
        case "ShowAllUsers":{
            return {...state,showusers:true}
        }
        case "HideAllUsers":{
            return {...state,showusers:false};
        }
        case "InputEnter":{
            return {...state,InputEnter:true};
        }
        case "InputLeave":{
            return {...state,InputEnter:false};
        }
        case "typing":{
            return {...state,isTyping:true};
        }
        case "typingPause":{
            return {...state,isTyping:false};
        }
        default :{
            throw new Error("not handled dispatch");
        }
    }
}

export default function ChatContext({children}){

    const [chat,dispatch]=useReducer(reducer,{data:null,join:false,isAdmin:false,showusers:false,InputEnter:false,isTyping:false});

    const {data,join,isAdmin,showusers,InputEnter,isTyping}=chat;

    return <Chatcontext.Provider value={{dispatch,join,data,isAdmin,showusers,InputEnter,isTyping}}>
        {children}
    </Chatcontext.Provider>
}

export function useChat(){

    const dispatch=useContext(Chatcontext);

    return dispatch;
}