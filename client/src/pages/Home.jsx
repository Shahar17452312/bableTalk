import { useState, useRef, useEffect } from "react";
import { Box, Paper, TextField, List, ListItem, Button } from "@mui/material";
import HamburgerMenu from "../components/HamburgerMenu.jsx";
import axios from "axios";
import "../styles/Home.css";

const Home = () => {
  const [searchChats, setSearchChats] = useState("");
  const [searchUsers, setSearchUsers] = useState("");
  const [chats, setChats] = useState([
    { id: 1, name: "John Doe", messages: ["Hello!"] },
    { id: 2, name: "Jane Smith", messages: ["Hey there!"] },
  ]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState(""); // משתנה להודעה שנשלחת

  const [onlineUsers,setOnlineUsers] = useState([]);

  const searchInputRef = useRef(null);
  const usersListRef = useRef(null);
  const userId=localStorage.getItem("id");
  const token=localStorage.getItem("token");

  const handleSearchChats = (event) => setSearchChats(event.target.value);
  const handleSearchUsers = (event) => setSearchUsers(event.target.value);

  const addUserToChats = (user) => {
    if (!chats.some((chat) => chat.id === user.id)) {
      setChats([...chats, { id: user.id, name: user.name, messages: [] }]);
    }
    setSearchUsers("");
  };

  const sendMessage = () => {
    if (message.trim() === "" || !selectedChat) return;

    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === selectedChat.id
          ? { ...chat, messages: [...chat.messages, message] }
          : chat
      )
    );

    setMessage(""); 
  };

  useEffect(() => {
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

  useEffect(()=>{
   const getUsers=async()=>{
    try{
      const users=await axios.get("http://localhost:3000/user/getAllUsers/"+userId,{
        headers:{
          Authorization:"Bearer "+token
        }
      });
      console.log(users.data);
      setOnlineUsers(users.data);
  
    }
    catch(error){

      console.error("error: "+error.message);
    }
  }

  getUsers();


  },[])

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
              .map((user) => (
                <ListItem key={user.id} button onClick={() => addUserToChats(user)}>
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
            {chats
              .filter((chat) =>
                chat.name.toLowerCase().includes(searchChats.toLowerCase())
              )
              .map((chat) => (
                <ListItem key={chat.id} button onClick={() => setSelectedChat(chat)}>
                  {chat.name}
                </ListItem>
              ))}
          </List>
        </Paper>

        {selectedChat && (
          <Paper className="chat-box" elevation={3}>
            <Box className="chat-messages">
              {selectedChat.messages.map((msg, index) => (
                <Box key={index} className="chat-message">
                  {msg}
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
              <Button variant="contained" color="primary" onClick={sendMessage}>
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
