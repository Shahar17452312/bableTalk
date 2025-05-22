import { Box, Paper, TextField, List, ListItem,Button } from "@mui/material";
import HamburgerMenu from "../components/HamburgerMenu.jsx";
import "../styles/Home.css";
import { useEffect, useState,useRef } from "react";
import axiosInstance from "../config/axios.js";
import { io } from "socket.io-client";



function Home() {
  const userId=localStorage.getItem("id");
  const preferredLanguage=localStorage.getItem("preferredLanguage");
  const[users,setUsers]=useState([]);
  const [searchUsers, setSearchUsers] = useState("");
  const [chats,setChats]=useState([]);
  const [selectedChatId,setSelectedChatId]=useState(null);
  const [message,setMessage]=useState("");
  const socketRef = useRef(null);

  // adding chats and users from database when the user entered to the home page
  useEffect(()=>{
    async function getUsers() {
      try{
        const allUsers=await axiosInstance.get("/user/getAllUsers/"+userId);
  
        return setUsers(allUsers.data);
      }
      catch(error){
        console.error("Failed to fetch users:", error);

      }
    }

    async function getChats() {
      try{
        const allChats=await axiosInstance.get("/user/getConversations/"+userId);
  
        return setChats(allChats.data);
      }
      catch(error){
        console.error("Failed to fetch users:", error);

      }
    }
    getChats();
    getUsers();

    


  },[]);

  //if the user clicke on the screen but not the search user bar, the list of this bar closed
  useEffect(() => {
    const listener = () => { setSearchUsers("") };
    document.body.addEventListener("click", listener);
  
    return () => {
      document.body.removeEventListener("click", listener);
    };
  }, []);

  //connection to the socket.io server
  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_URL);

    socketRef.current.on("connect", () => {
      console.log("Connected to socket.io server");
      socketRef.current.emit("register", userId);
    });

    socketRef.current.on("receiveMessage", (message) => {
      const newMessage={ 
        senderID: message.senderID,
        receiverID: message.receiverID,
        messageContent: message.messageContent,
        senderTranslation: message.senderTranslation,
        receiverTranslation: message.receiverTranslation,
        isRead: message.isRead,
        language: message.language,
        _id: message._id,
        createdAt: message.createdAt,
        
      }
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === message.conversationID
            ? { ...chat, messages: [...chat.messages, newMessage] }
            : chat
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  


  //adding new chat when the user clicks on a new user to send him a meesage from "search users" bar
  async function addToChats(newParticipantID){
    try{
      const foundChat = chats.find((chat) =>
        chat.participants.some((participant) => participant._id === newParticipantID)
      );
      if(foundChat){
        return;
      }
      const newChat=await axiosInstance.post("/user/addConversation/"+userId,{
        participantID:newParticipantID
      });

      console.log(newChat.participants);

      return setChats((prev)=>[...prev,newChat.data]);
    }
    catch(error){
      console.error("Failed to fetch users:", error);

    }
  }


  //add a message in the current chat and send the message to the other user using ws server
  async function sendMessage() {
    try{
      const receiver=chats.find((chat)=>chat._id===selectedChatId).participants.find((participant)=>participant._id!==userId);
      const receiverID=receiver._id;
      const data= {conversationID:selectedChatId,
        message:{
          senderID:userId,
          receiverID:receiverID,
          messageContent:message,
          senderTranslation:"",
          receiverTranslation:"",
          isRead:false,
          language:preferredLanguage   
        }
      };
      const newConversation=await axiosInstance.post("/user/addMessage/"+userId,data);

      //updating the chat in the UI
      setChats((prevChats)=>{
        const newChats= prevChats.map((chat)=>{
          if(chat._id===newConversation.data.conversation._id){
            return newConversation.data.conversation;
          }
          return chat
        });

        return newChats;
      });


      if (socketRef.current && socketRef.current.connected) {
        console.log(newConversation.data);
        socketRef.current.emit("sendMessage", {
          conversationID:newConversation.data.conversation._id,
          ...newConversation.data.newMessage
        });
      }


    }
    catch(error){
       console.error(error.message);
    }
  }

  

  
  return (
    <Box className="home-main-container">
        <Paper className="top-search" elevation={3} sx={{ backgroundColor: "#d1f7d1" }}>
          <TextField
            label="Search users"
            variant="outlined"
            fullWidth
            value={searchUsers}
            onChange={(e) => setSearchUsers(e.target.value)}
          />
          {searchUsers && (
            <List className="floating-users-list" sx={{ position: "absolute" }}>
              {users
                .filter(
                  (user) =>
                    user.name.toLowerCase().includes(searchUsers.toLowerCase()) &&
                    user._id !== userId
                )
                .map((user) => (
                  <ListItem key={user._id} button="true" onClick={()=>addToChats(user._id)}>
                    {user.name}
                  </ListItem>
                ))}
            </List>
          )}
        </Paper>


      <Box className="container">
        <Paper className="HamburgerPaper" sx={{ backgroundColor: "#d1f7d1" }} elevation={0}>
          <HamburgerMenu />
        </Paper>

        <Paper className="sidebar" elevation={3} sx={{ backgroundColor: "#1de9b6" }}>
          <TextField
            className="search-box"
            label="Search chats"
            variant="outlined"
            fullWidth
          />
          <List className="chat-list">
            {chats.map((chat)=>
            <ListItem key={chat._id} style={{ backgroundColor: "green",marginBottom:"5px" }} onClick={()=>setSelectedChatId(chat._id)}>
              {chat.participants.find((participant)=>participant._id!==userId).name}
            </ListItem>
          )}
            
          </List>
        </Paper>

        <Paper className="chat-box" elevation={3}>
          {selectedChatId && (
            <>
              {(() => {
                const currentChat = chats.find((chat) => chat._id === selectedChatId);
                return (
                  <>
                    <h4 style={{ textAlign: "center", color: "blue" }}>
                      {currentChat.participants.find((participant) => participant._id !== userId).name}
                    </h4>
                    <Box className="chat-messages" sx={{ display: "flex",flexDirection: "column"}}>
                      {currentChat.messages.map((message) =>
                        <Box key={message._id} className="chat-message" sx={{
                          backgroundColor: message.senderID===userId?"green":"blue",
                          maxWidth: "40%",
                          padding: "8px",
                          borderRadius: "8px",
                          display: "inline-block",
                          alignSelf:  message.senderID===userId?"flex-start":"flex-end",
                          wordWrap: "break-word",
                          overflowWrap: "break-word",
                          whiteSpace: "pre-wrap"
                        }}>
                          {message.senderID===userId?message.messageContent:message.receiverTranslation}
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        id="outlined-basic"
                        label={message?"":"Enter a message..."}
                        variant="outlined"
                        fullWidth
                        onChange={(e)=>setMessage(e.target.value)}
                      />
                      <Button variant="contained" onClick={sendMessage}>Send</Button>
                    </Box>


                  </>
                );
              })()}
            </>
          )}
      </Paper>

      </Box>
    </Box>
  );
};

export default Home;
