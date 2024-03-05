import { createContext, useContext, useState } from "react";


    const AuthContext=createContext();

export default function Auth({children}){

    const [auth,setAuth]=useState<string>("");

    return <>    
        <AuthContext.Provider value={{setAuth,auth}} >
            {children}
        </AuthContext.Provider>
    </>
}

export function useAuth(){
   const d=useContext(AuthContext);
    return d;
}