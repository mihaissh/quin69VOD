import React, { useEffect } from "react";
import { Box } from "@mui/material";
import YouTube from "react-youtube";

export default function YoutubeGames(props) {
  const { games, playerRef, part, setPart, setPlaying } = props;

  useEffect(() => {
    if (!playerRef.current) return;
    
    const gameData = games[part.part - 1];
    playerRef.current.loadVideoById(gameData.video_id, part.timestamp || 0);
  }, [part, playerRef, games]);

  const onReady = (event) => {
    playerRef.current = event.target;
    
    const gameData = games[part.part - 1];
    playerRef.current.loadVideoById(gameData.video_id, part.timestamp || 0);
  };

  const onPlay = () => {
    setPlaying({ playing: true });
  };

  const onPause = () => {
    setPlaying({ playing: false });
  };

  const onEnd = () => {
    setPlaying({ playing: false });
    
    const nextPart = part.part + 1;
    if (nextPart <= games.length) {
      setPart({ part: nextPart, timestamp: 0 });
    }
  };

  const onError = (event) => {
    if (event.data !== 150) console.error("Player error:", event.data);
  };

  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
        "& iframe": {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%"
        }
      }}
    >
      <YouTube
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 1,
            playsinline: 1,
            rel: 0,
            modestbranding: 1,
            iv_load_policy: 3,
            controls: 1,
            fs: 1,
            mute: 1,
          },
        }}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        onEnd={onEnd}
        onError={onError}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </Box>
  );
}
