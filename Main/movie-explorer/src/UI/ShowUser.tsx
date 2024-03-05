import { useEffect, useState } from "react";
import { data } from "./HOME/PastUser";

export default function ShowUser({Data}:{Data:data[]}){

//Name:string|undefined,Info:string|undefined,Url:string|undefined}

//const {Name,Info,Url}=Data[0]; 

const [s,setS]=useState<data>({Name:"",Info:"",Url:""});

useEffect(function(){
  setS({Name:Data[0].Name,Url:Data[0].Url,Info:Data[0].Info})
},[Data])

  function handleClick(num:number){
    setS((s)=>{
      return {...s,Name:Data[num].Name,Info:Data[num].Info,Url:Data[num].Url}
    });
  }

    return <>
    {Data?<li style={{backgroundColor:"#e63946"}} className="mt-[10px] sm:mt-[20px] rounded-lg">
    <div className="h-[100px] sm:h-[250px] grid grid-cols-2 grid-rows-2 gap-[5px] sm:gap-[10px]">
      <div className="col-start-1 col-end-2 row-start-1 row-end-3 flex justify-center items-center">
      <img src={s.Url} alt="nope" className="align-center h-[50px]  pl-[10px] sm:h-[100px] md:h-[170px]"/>
      </div>
      <div className="col-start-2 col-end-3 row-start-1 row-end-2">
        <h2 className="pt-[10px] sm:pt-[50px] text-white font-roboto">{s.Name}</h2>
      </div>
      <div className="col-start-2 col-end-3 row-start-2 row-end-3 font-roboto text-white">
        <p>{s.Info}</p>
      </div>
    </div>
    <div className="flex justify-center gap-[3px] sm:gap-[6px] pb-[20px]">
      <button className="text-center p-[5px] rounded-full bg-[white] hover:bg-slate-700" onClick={()=>handleClick(0)}></button>
      <button className="text-center p-[5px]  rounded-full bg-[white] hover:bg-slate-700" onClick={()=>handleClick(1)}></button>
      <button className="text-center p-[5px]  rounded-full bg-[white] hover:bg-slate-700" onClick={()=>handleClick(2)}></button>
      </div>
    </li>:<p>Loading</p>}
    </>

/*
 <p>{Name}</p>
    <img src={Url} alt="nope" />
    <h2>{Info}</h2>*/
}