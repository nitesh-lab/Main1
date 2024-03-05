
import { Outlet } from "react-router-dom";
import Header from "./Header";


export default function AppLayout(){
    
     

   return (<>
          <div  className="h-[100vh]">
       <Header />
      <Outlet/>
      </div>
        </>
    )
}