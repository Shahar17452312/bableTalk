import { Box,Paper } from "@mui/material";
import HamburgerMenu from "../components/HamburgerMenu";


function Profile(){

       return (
        <Box>
            <Paper className="HamburgerPaper" sx={{ backgroundColor: "#d1f7d1" }} elevation={0}>
                <HamburgerMenu />
            </Paper>
        </Box>
    )
}


export default Profile;