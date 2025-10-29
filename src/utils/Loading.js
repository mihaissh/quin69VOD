import { Box, Typography, Fade } from "@mui/material";
import LoadingSVG from "../components/LoadingSVG";

export default function Loading({ message }) {
  return (
    <Fade in timeout={300}>
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "100%", 
          width: "100%", 
          flexDirection: "column",
          minHeight: "300px",
        }}
      >
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column", 
            justifyContent: "center", 
            alignItems: "center",
            gap: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.main",
            }}
          >
            <LoadingSVG size={80} />
          </Box>
          {message && (
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                fontWeight: 500,
                letterSpacing: "0.5px",
                textAlign: "center",
              }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Fade>
  );
}
