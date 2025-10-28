import { useState } from "react";
import { Box, Tooltip, IconButton, Menu, MenuItem, Typography, Avatar, Chip } from "@mui/material";
import humanize from "humanize-duration";
import { toSeconds } from "../utils/helpers";
import { Icon } from "@iconify/react";

export default function Chapters(props) {
  const { chapters, chapter, setPart, youtube, setChapter, setTimestamp } = props;
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleChapterClick = (data) => {
    if (youtube) {
      let part = 1,
        timestamp = data?.start || toSeconds(data.duration);
      if (timestamp > 1) {
        for (let data of youtube) {
          if (data.duration > timestamp) {
            part = data?.part || 1;
            break;
          }
          timestamp -= data.duration;
        }
      }
      setPart({ part: part, timestamp: timestamp });
    } else {
      setTimestamp(data?.start || toSeconds(data.duration));
    }
    setChapter(data);
    setAnchorEl(null);
  };

  return (
    <Box>
      <Tooltip title={`Current: ${chapter.name}`} arrow>
        <IconButton 
          onClick={handleClick}
          sx={{
            p: 0.5,
            border: "2px solid",
            borderColor: "primary.main",
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 4px 12px rgba(139, 92, 246, 0.4)",
            },
          }}
        >
          <Avatar
            src={getImage(chapter.image)}
            alt={chapter.name}
            variant="rounded"
            sx={{ 
              width: 48, 
              height: 64,
            }}
          />
        </IconButton>
      </Tooltip>
      <Menu 
        anchorEl={anchorEl} 
        keepMounted 
        open={Boolean(anchorEl)} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            maxWidth: "320px",
            maxHeight: "480px",
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <Box sx={{ 
          p: 1.5, 
          borderBottom: "1px solid", 
          borderColor: "divider",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
        }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Icon icon="mdi:book-open-variant" width={20} style={{ color: "#8B5CF6" }} />
            <Typography variant="subtitle2" fontWeight={700}>
              Chapters
            </Typography>
          </Box>
        </Box>
        {chapters.map((data, _) => {
          const isSelected = data.start === chapter.start;
          return (
            <MenuItem 
              onClick={() => handleChapterClick(data)} 
              key={(data?.gameId || data.name) + (data?.start || data.duration)} 
              selected={isSelected}
              sx={{
                py: 1.5,
                px: 2,
                gap: 1.5,
                borderLeft: "3px solid",
                borderColor: isSelected ? "primary.main" : "transparent",
                backgroundColor: isSelected ? "rgba(139, 92, 246, 0.08)" : "transparent",
                "&:hover": {
                  backgroundColor: isSelected ? "rgba(139, 92, 246, 0.12)" : "rgba(255, 255, 255, 0.05)",
                  borderColor: "primary.main",
                },
              }}
            >
              <Avatar
                src={getImage(data.image)}
                alt={data.name}
                variant="rounded"
                sx={{ 
                  width: 48, 
                  height: 64,
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                }}
              />
              <Box sx={{ display: "flex", flexDirection: "column", flex: 1, gap: 0.5, minWidth: 0 }}>
                <Typography 
                  variant="body2" 
                  fontWeight={600}
                  sx={{ 
                    color: isSelected ? "primary.main" : "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {data.name}
                </Typography>
                {data.end !== undefined && (
                  <Chip 
                    icon={<Icon icon="mdi:clock-outline" width={12} />}
                    label={humanize(data.end * 1000, { largest: 2, round: true })}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      alignSelf: "flex-start",
                      backgroundColor: "rgba(255, 255, 255, 0.05)",
                      "& .MuiChip-icon": {
                        color: "text.secondary",
                        marginLeft: 0.5,
                      },
                    }}
                  />
                )}
              </Box>
              {isSelected && (
                <Icon icon="mdi:play-circle" width={20} style={{ color: "#8B5CF6" }} />
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}

//Support older vods that had {width}x{height} in the link
const getImage = (link) => {
  if (!link) return "https://static-cdn.jtvnw.net/ttv-static/404_boxart.jpg";
  return link.replace("{width}x{height}", "40x53");
};
