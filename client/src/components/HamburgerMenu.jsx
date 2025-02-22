import { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const HamburgerMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box 
      sx={{ 
        position: "absolute", 
        top: 10, 
        left: 10, 
        zIndex: 1000, 
        backgroundColor: "#d1f7d1", 
        borderRadius: "10px",
        padding: "5px"
      }}
    >
      <IconButton onClick={handleClick}>
        <MenuIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>🏠 Home</MenuItem>
        <MenuItem onClick={handleClose}>👤 Profile</MenuItem>
        <MenuItem onClick={handleClose}>✏️ Edit Profile</MenuItem>
        <MenuItem onClick={handleClose}>ℹ️ About</MenuItem>
      </Menu>
    </Box>
  );
};

export default HamburgerMenu;
