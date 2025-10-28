import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import YouTube from "react-youtube";

export default function YoutubePlayer(props) {
  const { youtube, playerRef, part, setPart, setCurrentTime, delay, setPlaying } = props;
  const timeUpdateRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) return;

    const index = youtube.findIndex((data) => data.part === part.part);
    const videoId = youtube[index !== -1 ? index : part.part - 1].id;
    
    playerRef.current.loadVideoById(videoId, part.timestamp || 0);
  }, [part, playerRef, youtube]);

  const timeUpdate = () => {
    if (!playerRef.current) return;
    if (playerRef.current.getPlayerState() !== 1) return;
    
    let currentTime = 0;
    for (let video of youtube) {
      if (video.part >= part.part) break;
      currentTime += video.duration;
    }
    currentTime += playerRef.current.getCurrentTime();
    currentTime += delay;
    setCurrentTime(currentTime);
  };

  const loopTimeUpdate = () => {
    if (timeUpdateRef.current !== null) clearTimeout(timeUpdateRef.current);
    timeUpdateRef.current = setTimeout(() => {
      timeUpdate();
      loopTimeUpdate();
    }, 1000);
  };

  const clearTimeUpdate = () => {
    if (timeUpdateRef.current !== null) clearTimeout(timeUpdateRef.current);
  };

  const onReady = (event) => {
    playerRef.current = event.target;
    
    const index = youtube.findIndex((data) => data.part === part.part);
    const videoId = youtube[index !== -1 ? index : 0].id;
    playerRef.current.loadVideoById(videoId, part.timestamp || 0);
  };

  const onPlay = () => {
    timeUpdate();
    loopTimeUpdate();
    setPlaying({ playing: true });
  };

  const onPause = () => {
    clearTimeUpdate();
    setPlaying({ playing: false });
  };

  const onEnd = () => {
    clearTimeUpdate();
    setPlaying({ playing: false });
    
    const nextPart = part.part + 1;
    if (nextPart <= youtube.length) {
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
