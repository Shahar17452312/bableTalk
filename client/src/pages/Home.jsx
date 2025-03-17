import {Paper,List,ListItemButton} from "@mui/material";
import axios from "axios";
import "../styles/Home.css"
import { useEffect, useState } from "react";


function Home(){

  const userId=localStorage.getItem("id");
  const token=localStorage.getItem("token");
  const [chats,setChats]=useState([]);

  useEffect(()=>{
   const getConversations=async()=>{
    try{
      const conversations=await axios.get("http://localhost:3000/user/getConversations/"+userId,{
        headers:{
          Authorization:"Bearer "+token
        }
      });

      setChats(conversations.data);

    }

    catch(error){
      console.error("error:",error.message);
      setChats([]);
    }
    
   }

   getConversations();
  },[]);

return (
<div className="homeContainer">
  <Paper  elevation={3} className="homeListOfChats" sx={{height:"100%",width:"30%",backgroundColor:"#4caf50",overflowY:"auto"}}>
      <List> 
      {
         chats
         .map((chat) => chat.participants) 
         .flat() 
         .filter((participant) => participant._id !== userId) 
         .map((participant) => (
           <ListItemButton key={participant._id}>
             {participant.name}
           </ListItemButton>
         ))
      }

      </List>
  </Paper>

  <Paper  elevation={3} className="homeCurrentChat"  sx={{height:"100%",width:"70%",backgroundColor:"#4caf50"}}>
      advdavava
  </Paper>
</div>)

}


export default Home