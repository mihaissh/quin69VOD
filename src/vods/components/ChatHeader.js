import React, { memo } from "react";
import { Box, Typography, Tooltip, IconButton } from "@mui/material";
import { Icon } from "@iconify/react";

const ChatHeader = memo(({ isPortrait, onToggleChat, onOpenSettings }) => (
  <Box 
    sx={{ 
      display: "grid", 
      alignItems: "center", 
      p: 1,
      backgroundColor: "rgba(255, 255, 255, 0.02)",
      borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
    }}
  >
    {!isPortrait && (
      <Box sx={{ justifySelf: "left", gridColumnStart: 1, gridRowStart: 1, zIndex: 1 }}>
        <Tooltip title="Hide Chat" placement="bottom">
          <IconButton 
            onClick={onToggleChat} 
            size="small"
            sx={{
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              }
            }}
          >
            <Icon icon="mdi:chevron-right" width={20} />
          </IconButton>
        </Tooltip>
      </Box>
    )}
    <Box sx={{ justifySelf: "center", gridColumnStart: 1, gridRowStart: 1 }}>
      <Typography variant="body1" fontWeight={600}>Chat Replay</Typography>
    </Box>
    <Box sx={{ justifySelf: "end", gridColumnStart: 1, gridRowStart: 1, zIndex: 1 }}>
      <Tooltip title="Chat Settings" placement="bottom">
        <IconButton 
          onClick={onOpenSettings} 
          size="small"
          sx={{
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)",
            }
          }}
        >
          <Icon icon="mdi:cog" width={18} />
        </IconButton>
      </Tooltip>
    </Box>
  </Box>
));

ChatHeader.displayName = 'ChatHeader';

export default ChatHeader;



