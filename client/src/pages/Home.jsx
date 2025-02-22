import { useState } from "react";
import { Box, Paper, TextField, List, ListItem, Typography, Button } from "@mui/material";
import HamburgerMenu from "../components/HamburgerMenu.jsx"
import "../styles/Home.css";

const Home = () => {
  const [search, setSearch] = useState("");
  const [chats] = useState([
    { id: 1, name: "John Doe", messages: ["Hello!"] },
    { id: 2, name: "Jane Smith", messages: ["Hey there!"] },
  ]);
  const [selectedChat, setSelectedChat] = useState(null);


  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <Box className="home-main-container"  >

      <Box className="container">

        <Paper className="HamburgerPaper" sx={{backgroundColor:"#d1f7d1"}} elevation={0}>
          <HamburgerMenu/>
        </Paper>

        <Paper className="sidebar" elevation={3} sx={{ backgroundColor: "#1de9b6" }}>
          <TextField
            className="search-box"
            label="Search users"
            variant="outlined"
            fullWidth
            value={search}
            onChange={handleSearch}
          />
          <List className="chat-list">
            {chats
              .filter((chat) => chat.name.toLowerCase().includes(search.toLowerCase()))
              .map((chat) => (
                <ListItem key={chat.id} button onClick={() => setSelectedChat(chat)} style={{ border: "1px solid black", margin: "3px" }}>
                  {chat.name}
                </ListItem>
              ))}
          </List>
        </Paper>
        {selectedChat && (
          <Paper className="chat-box" elevation={3}>
            <Typography className="chat-header">Chat with {selectedChat.name}</Typography>
            <Box className="chat-messages">
              {selectedChat.messages.map((msg, index) => (
                <Typography key={index} className="chat-message">
                  {msg}
                </Typography>
              ))}
            </Box>
            <Box display="flex" alignItems="center" gap={2}>
              <TextField id="message" name="message" label="Enter your message here" variant="outlined" fullWidth />
              <Button variant="contained" color="primary">
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
