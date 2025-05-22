import { useState } from "react";
import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const HamburgerMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNavigate = (path) => {
    setAnchorEl(null); // סגירת התפריט קודם
    setTimeout(() => {
      navigate(path);  // ניווט אחרי סגירה
    }, 100); // השהיה קטנה כדי לאפשר לתפריט להיסגר קודם
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
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleNavigate("/home")}>🏠 Home</MenuItem>
        <MenuItem onClick={() => handleNavigate("/profile")}>👤 Profile</MenuItem>
        <MenuItem onClick={() => handleNavigate("/editProfile")}>✏️ Edit Profile</MenuItem>
        <MenuItem onClick={() => handleNavigate("/about")}>ℹ️ About</MenuItem>
      </Menu>
    </Box>
  );
};

export default HamburgerMenu;
