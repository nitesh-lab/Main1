import {v4 as uuidv4} from "uuid";

export async function getChannels(axiosPrivate){

   const data=await axiosPrivate.get("/channel/");
    return data.data;
}

export async function CreateChannel(name,axiosPrivate,selectedFile){

    let str = "Room/";
    let random = uuidv4();
    let result = str +random;

    console.log(selectedFile);

//     const formData = new FormData();
// formData.append('file', event.target.files[0]);

  const formdata=new FormData();
  formdata.append("file",selectedFile);
  formdata.append("name",name);

  const res = await axiosPrivate.post("/channel/createChannel", formdata, {
    params: { Link: result } // Send 'Link' as a query parameter
});

  return res;
}

export async function  getSingleChannel(uniqueKey,axiosPrivate){

    const res=await axiosPrivate.post("/channel/getSingleChannel",{link:uniqueKey})
    return res.data;
}

export async function JoinChannelUser(axiosPrivate,link){

  const response=await axiosPrivate.post("/channel/joinChannel",{
    link},{headers:{
      "Content-type":"application/json"
    }})

    return response.data;
  }

  export async function GetAllUsers(axiosPrivate,Link){

    const response=await axiosPrivate.post("/channel/GetAllUsers",{Link});

    return response.data;
  }