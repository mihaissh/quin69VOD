import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import { toHHMMSS } from "../../utils/helpers";
import BadgeRenderer from "./BadgeRenderer";
import MessageRenderer from "./MessageRenderer";
import { ensureAccessibleTextColor } from "../ChatUtils";

const ChatMessage = memo(({ comment, showTimestamp, badges, emotesMap }) => {
  const userColor = ensureAccessibleTextColor(comment.user_color);

  return (
    <Box 
      className="chat-message"
      sx={{ 
        width: "100%",
        transition: "background-color 0.2s ease-in-out",
      }}
    >
      <Box sx={{ alignItems: "flex-start", display: "flex", flexWrap: "nowrap", width: "100%", pl: 0.5, pt: 0.5, pr: 0.5, pb: 0.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
          {showTimestamp && (
            <Box sx={{ display: "inline", pl: 1, pr: 1, flexShrink: 0 }}>
              <Typography variant="caption" color="textSecondary">
                {toHHMMSS(comment.content_offset_seconds)}
              </Typography>
            </Box>
          )}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {comment.user_badges && (
              <BadgeRenderer textBadges={comment.user_badges} badges={badges} />
            )}
            <Box sx={{ textDecoration: "none", display: "inline" }}>
              <span style={{ color: userColor, fontWeight: 600, textShadow: "0 1px 1px rgba(0,0,0,0.8)" }}>
                {comment.display_name}
              </span>
            </Box>
            <Box sx={{ display: "inline" }}>
              <span>: </span>
              <MessageRenderer fragments={comment.message} emotesMap={emotesMap} />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function for better performance
  return (
    prevProps.comment.id === nextProps.comment.id &&
    prevProps.showTimestamp === nextProps.showTimestamp &&
    prevProps.badges === nextProps.badges &&
    prevProps.emotesMap === nextProps.emotesMap
  );
});

ChatMessage.displayName = 'ChatMessage';

export default ChatMessage;