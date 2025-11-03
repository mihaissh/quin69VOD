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
        px: 1,
        py: 0.5,
        display: "block",
        lineHeight: "30px",
        wordWrap: "break-word",
        overflowWrap: "break-word",
      }}
    >
      {showTimestamp && (
        <Typography 
          component="span"
          variant="caption" 
          color="textSecondary"
          sx={{ mr: 1 }}
        >
          {toHHMMSS(comment.content_offset_seconds)}
        </Typography>
      )}
      {comment.user_badges && (
        <BadgeRenderer textBadges={comment.user_badges} badges={badges} />
      )}
      <span style={{ color: userColor, fontWeight: 600, textShadow: "0 1px 1px rgba(0,0,0,0.8)" }}>
        {comment.display_name}
      </span>
      <span>: </span>
      <MessageRenderer fragments={comment.message} emotesMap={emotesMap} />
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