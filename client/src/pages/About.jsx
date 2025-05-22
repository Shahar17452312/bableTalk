import { Typography, Container, Paper, Box } from "@mui/material";
import HamburgerMenu from "../components/HamburgerMenu";

const About = () => {
  return (
    <Box sx={{ position: "relative", height: "100vh", width: "100vw", overflow: "hidden" }}>
      {/* תפריט ההמבורגר — קבוע בפינה עליונה */}
      <HamburgerMenu />

      {/* תוכן מרכזי */}
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", px: 2 }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, backgroundColor: "#5F9EA0", borderRadius: 2, color: "#fff" }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
              About the App
            </Typography>

            <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
              This chat application is designed to break language barriers and enable people from different cultures and backgrounds to communicate effortlessly.
            </Typography>

            <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
              Let's say you speak Hebrew and the other person speaks Amharic — with our app, your message will automatically be translated into Amharic, and their response will be translated into Hebrew.
            </Typography>

            <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
              This real-time translation feature ensures that language is no longer a limitation, making global communication seamless, inclusive, and accessible to everyone.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default About;
