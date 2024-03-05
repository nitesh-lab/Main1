import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import { Navigate, RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Summmary from "./pages/Summary";
//import AppLayout from "./UI/AppLayout";

import AppLayout from "./UI/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LoginComponent from "./pages/Login";
import SignupComponent from "./pages/Signup";
import Room from "./pages/Room";
import Auth from "./Context/Auth";
import MainRoom from "./UI/MainRoom";
import AdminDashBoard from "../AdminDashBoard";


const client=new QueryClient({
  defaultOptions:{
      queries:{
        staleTime:5*60*1000,
      }
      }
});

const route=createBrowserRouter([
  { 
    path:"/",
    element:<AppLayout/>,
    children:[
      {
       path:"/",
       element:<Navigate to="home" />,
      }
      ,
      {
        path:"home",
        element:<Home/>
      },
      {
        path:"Summary",
        element:<Summmary/>
      },
      {
        path:"login",
        element:<LoginComponent/>
      },
      {
        path:"signup",
        element:<SignupComponent/>
      },{
        path:"main",
        element:<MainRoom/>
      },
      {
        path:"admin",
        element:<AdminDashBoard/>
      }
    ]
    },
    {
      path:"/room",
      element:<Room/>
    }
  ]
    );

export default function App(){
  
 /* const data:obj|undefined=useDarkMode();
    let mode:boolean=false;

    if (data){
      const {light}=data;
      mode=light;
    }*/


  return  ( 
    <>
   <QueryClientProvider client={client}>
    <Auth>
      <RouterProvider router={route}>
      </RouterProvider>    
  </Auth>
  <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider> 
  </>  
)
}