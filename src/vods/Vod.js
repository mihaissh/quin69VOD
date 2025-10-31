import React, { memo, useMemo } from "react";
import { Box, Typography, Grid, CardMedia, Chip, Stack, Fade } from "@mui/material";
import CustomLink from "../utils/CustomLink";
import Chapters from "./ChaptersMenu";
import CustomWidthTooltip from "../utils/CustomToolTip";
import dayjs from "dayjs";
import { toHHMMSS } from "../utils/helpers";
import relativeTime from "dayjs/plugin/relativeTime.js";
import { Icon } from "@iconify/react";
dayjs.extend(relativeTime);

const EASTER_EGG_EMOTE_URL = "https://cdn.7tv.app/emote/01HAZ9VXPG0005HE0A9M4Z1YQ6/2x.avif";

const VodCard = memo(({ vod, game, gridSize, index, showEasterEgg }) => {
  const gameLink = `/games/${vod.id}?game_id=${game.id}`;
  // Prioritize first few images for LCP
  const isAboveFold = index < 4;
  
  const gameDuration = useMemo(() => {
    let duration = parseInt(game.end_time);
    const defaultDelay = process.env.REACT_APP_DEFAULT_DELAY;
    while (duration > defaultDelay) {
      duration -= defaultDelay;
    }
    return duration;
  }, [game.end_time]);

  const relativeDate = useMemo(() => 
    dayjs(vod.createdAt).fromNow(), 
    [vod.createdAt]
  );

  return (
    <Grid key={game.id} size={{ xs: 12, sm: 6, md: 4, lg: gridSize }}>
      <CustomLink 
        href={gameLink} 
        sx={{ 
          textDecoration: "none", 
          display: "block", 
          height: "100%",
          "&:hover": {
            opacity: 1, // Override CustomLink's default hover opacity
          },
        }}
      >
        <Box 
          sx={{ 
            height: "100%", 
            display: "flex", 
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            backgroundColor: "background.paper",
            border: "1px solid rgba(255, 255, 255, 0.05)",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              transform: "translateY(-4px)",
              boxShadow: (theme) => {
                const primaryColor = theme.palette.primary.main;
                // Convert hex to rgb for rgba usage
                const r = parseInt(primaryColor.slice(1, 3), 16);
                const g = parseInt(primaryColor.slice(3, 5), 16);
                const b = parseInt(primaryColor.slice(5, 7), 16);
                return `0 8px 24px rgba(${r}, ${g}, ${b}, 0.15), 0 4px 12px rgba(${r}, ${g}, ${b}, 0.1)`;
              },
              borderColor: "rgba(139, 92, 246, 0.3)",
            },
          }}
        >
          {/* Thumbnail Container */}
          <Box 
            sx={{ 
              position: "relative", 
              paddingTop: "56.25%", 
              overflow: "hidden", 
              backgroundColor: "#000",
              borderRadius: "12px 12px 0 0",
            }}
          >
            <CardMedia
              component="img"
              image={game.thumbnail_url}
              alt={game.title}
              loading={isAboveFold ? "eager" : "lazy"}
              fetchPriority={isAboveFold ? "high" : "auto"}
              decoding="async"
              draggable={false}
              sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "12px 12px 0 0",
              }}
            />
            
            {/* Easter Egg Dark Background Overlay */}
            <Fade in={showEasterEgg} timeout={{ enter: 400, exit: 400 }}>
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  backdropFilter: "blur(4px)",
                  zIndex: 1,
                  pointerEvents: "none",
                }}
              />
            </Fade>
            
            {/* Easter Egg Emote Overlay - Only render when active */}
            {showEasterEgg && (
              <Fade in={showEasterEgg} timeout={{ enter: 400, exit: 400 }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: { xs: "80px", sm: "110px", md: "140px" },
                    height: { xs: "80px", sm: "110px", md: "140px" },
                    zIndex: 2,
                    pointerEvents: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={EASTER_EGG_EMOTE_URL}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 8px rgba(139, 92, 246, 0.5))",
                    }}
                  />
                </Box>
              </Fade>
            )}
            
            {/* Duration Badge */}
            <Chip
              icon={<Icon icon="mdi:clock-outline" width={14} />}
              label={toHHMMSS(gameDuration)}
              size="small"
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.85)",
                color: "white",
                fontSize: "0.7rem",
                fontWeight: 600,
                height: 24,
                zIndex: 10,
                "& .MuiChip-icon": {
                  color: "#8B5CF6",
                  marginLeft: 0.5,
                },
              }}
            />
          </Box>

          {/* Info Section - All in one card */}
          <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
            <Stack spacing={1.5}>
              {/* Game Title */}
              <CustomWidthTooltip title={game.title} placement="top">
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    color: "text.primary",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.3,
                    minHeight: "2.6em",
                  }}
                >
                  {game.title}
                </Typography>
              </CustomWidthTooltip>

              {/* VOD Name */}
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: "0.85rem",
                  color: "text.secondary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {vod.title}
              </Typography>

              {/* Meta Info */}
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={0.5}>
                <Chapters game={game} />
                <Chip
                  icon={<Icon icon="mdi:calendar" width={12} />}
                  label={relativeDate}
                  size="small"
                  sx={{
                    height: 22,
                    fontSize: "0.7rem",
                    fontWeight: 500,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    color: "text.secondary",
                    "& .MuiChip-icon": {
                      color: "text.secondary",
                      marginLeft: 0.5,
                    },
                  }}
                />
              </Stack>
            </Stack>
          </Box>
        </Box>
      </CustomLink>
    </Grid>
  );
});

VodCard.displayName = 'VodCard';

export default function Vod(props) {
  const { vod, gridSize, index = 0, showEasterEgg = false } = props;

  const reversedGames = useMemo(() => 
    [...vod.games].reverse(), 
    [vod.games]
  );

  return reversedGames.map((game, gameIndex) => (
    <VodCard key={game.id} vod={vod} game={game} gridSize={gridSize} index={index + gameIndex} showEasterEgg={showEasterEgg} />
  ));
}
