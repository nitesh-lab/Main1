import { useNavigate } from "react-router-dom"
export default function DashBoard(){

    const nav=useNavigate();

   return (<>   
    <div>
        <div  className="h-[300px] sm:h-[300px] md:h-[500px] bg-custom-03045e">
        <p className="  text-sm sm:text-lg md:text-[28px] lg:text-[32px] font-bold text-white   font-roboto    ml-[30px] pt-[20px]  sm:pt-[50px]  md:pt-[100px]  sm:ml-[100px] ">Join Exciting.</p>
        <p className=" text-sm sm:text-lg md:text-[28px] lg:text-[32px] font-semibold text-white font-roboto ml-[25px] mt-[10px] sm:mt-[20px] md:mt-[30px] sm:ml-[90px]">Community...</p>
        <CenteredImage  imageUrl={"images/img.png"}></CenteredImage>
      
        <div className="flex gap-[20px] justify-center mt-[20px] ">
        <button className="glow-on-hover"   onClick={()=>nav("/login")}>Login</button>
        <button className="glow-on-hover" onClick={()=>nav("/signup")}>Sign Up</button>
        </div>
        </div>
    </div>
    </>
    )
}


function CenteredImage({ imageUrl }) {
  return (
    <div className="flex justify-center  ">
      <img src={imageUrl} alt="Centered Image" className=" w-[30px] sm:w-[40px] md:w-[50px] lg:w-[70px]" />
    </div>
  );
}

