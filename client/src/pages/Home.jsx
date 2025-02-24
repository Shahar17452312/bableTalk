import { useState, useRef, useEffect } from "react";
import { Box, Paper, TextField, List, ListItem, Button } from "@mui/material";
import HamburgerMenu from "../components/HamburgerMenu.jsx";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
  const [searchChats, setSearchChats] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState(""); 

  const [onlineUsers,setOnlineUsers] = useState([]);

  const searchInputRef = useRef(null);
  const usersListRef = useRef(null);
  const userId=localStorage.getItem("id");
  const userName=localStorage.getItem("name");
  const token=localStorage.getItem("token");

  const handleSearchChats = (event) => setSearchChats(event.target.value);
  const handleSearchUsers = (event) => setSearchUsers(event.target.value);

  const addUserToChats = async(user) => {// adding the chosen user of the serach box inside the chats box
    const hasChatAlready = chats.some((chat) => 
      chat.participants.some((participant) => participant._id===user.id)
    );
      

    console.log(hasChatAlready);


    if (!hasChatAlready&&(user.id!==userId)) {
      try{
        const newChat=await axios.post("http://localhost:3000/user/addConversation/"+userId,{
          participantID:user.id
        },{
          headers:{
            Authorization:"Berear "+token
          }
        });
        console.log("new conversation:",newChat.data);
        setChats((prevChats) => [...prevChats,newChat.data]);
        
      }
      catch(error){
        console.error("error: "+error.message);
      }
    }
    setSearchUsers("");
  };

  useEffect(() => {//click listeners
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target) &&
        usersListRef.current &&
        !usersListRef.current.contains(event.target)
      ) {
        setSearchUsers("");
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(()=>{// requset for the getAllUsers to be able to search for new user and request for adding the current chats the user has
   const getUsersAndChats=async()=>{
    try{
      const users=await axios.get("http://localhost:3000/user/getAllUsers/"+userId,{
        headers:{
          Authorization:"Bearer "+token
        }
      });
      setOnlineUsers(users.data);

      const chats=await axios.get("http://localhost:3000/user/getConversations/"+userId,{
        headers:{
          Authorization:"Bearer "+token
        }
      });
      console.log(chats.data)

      setChats(chats.data);
  
    }
    catch(error){

      console.error("error: "+error.message);
    }
  }

  getUsersAndChats();


  },[])


 async function sendMessage(){//handling the new message that sent to the user and post it on the screen

    const recieverID=selectedChat.participants.find((participant)=>participant._id!==userId);
    const language=localStorage.getItem("preferredLanguage");
    try{
      const updatedConversation=await axios.post("http://localhost:3000/user/addMessage/"+userId,{
        conversationID:selectedChat._id,
        conversationParticipants:selectedChat.participants,
        message:{
          senderID:userId,
          receiverID:recieverID,
          messageContent:message,
          language:language
        }
      },{
        headers:{
          Authorization:"Bearer "+token
        }
      });
      console.log(updatedConversation.data.messages.at(-1).messageContent);



      setSelectedChat((prevChat) => {
    
        const updatedMessages = [...prevChat.messages, updatedConversation.data.messages.at(-1)];
    
        return { ...prevChat, messages: updatedMessages };
    });
    

      setMessage("");




    }

    catch(error){
      console.error("error: ",error.message);
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
          onChange={handleSearchUsers}
          inputRef={searchInputRef}
        />

        {searchUsers && (
          <List className="floating-users-list" ref={usersListRef} sx={{ position: "absolute" }}>
            {onlineUsers
              .filter((user) =>
                user.name.toLowerCase().includes(searchUsers.toLowerCase())
              )
              .map((user) => {
                if(user.name!=userName){
                  return <ListItem key={user.id} button onClick={() => addUserToChats(user)}>
                  {user.name}
                  </ListItem>
                }

              }
                
            )}
          </List>
        )}
      </Paper>

      <Box className="container">
        <Paper className="HamburgerPaper" sx={{ backgroundColor: "#d1f7d1" }} elevation={0}>
          <HamburgerMenu />
        </Paper>

        {/* חיפוש שיחות קיימות */}
        <Paper className="sidebar" elevation={3} sx={{ backgroundColor: "#1de9b6" }}>
          <TextField
            className="search-box"
            label="Search chats"
            variant="outlined"
            fullWidth
            value={searchChats}
            onChange={handleSearchChats}
          />
          <List className="chat-list">
            {chats.map((chat,index) => {
              console.log(chat.participants);
              const nameOfChat=chat.participants.find((participant)=>participant._id!==userId);
              console.log(nameOfChat);
              return (
                <ListItem key={index} onClick={() => setSelectedChat(chat)}>
                  {nameOfChat.name}
                </ListItem>
              )
            })}
          </List>
        </Paper>

        {selectedChat && (
          <Paper className="chat-box" elevation={3}>
            <Box className="chat-messages">
              {selectedChat.messages.map((msg, index) => (
                <Box key={index} className="chat-message">
                  {msg.messageContent}
                </Box>
              ))}
            </Box>
            {/* תיבת טקסט לשליחת הודעה */}
            <Box className="message-input-container" sx={{ display: "flex", gap: 1, padding: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                label="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button variant="contained" color="primary" onClick={sendMessage} >
                Send
              </Button>
            </Box>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default Home;
