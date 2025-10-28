import LoadingLogo from "../assets/loading.gif";
import { Box, CircularProgress, Typography, Fade } from "@mui/material";
import { keyframes } from "@mui/system";

const pulse = keyframes`
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
`;

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
              animation: `${pulse} 2s ease-in-out infinite`,
            }}
          >
            <img 
              alt="Loading" 
              src={LoadingLogo} 
              style={{ 
                height: "auto", 
                maxWidth: "100%", 
                maxHeight: 150,
                borderRadius: "8px",
              }} 
            />
          </Box>
          <CircularProgress 
            size={48} 
            thickness={4}
            sx={{ 
              color: "primary.main",
            }} 
          />
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
