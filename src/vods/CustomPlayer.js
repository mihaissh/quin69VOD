import React, { useRef, useEffect, useState } from "react";
import canAutoPlay from "can-autoplay";
import { Button, Box, Alert, Paper } from "@mui/material";
import VideoJS from "./VideoJS";
import "videojs-hotkeys";
import { toSeconds } from "../utils/helpers";

export default function Player(props) {
  const { playerRef, setCurrentTime, setPlaying, type, vod, timestamp, delay, setDelay } = props;
  const timeUpdateRef = useRef(null);
  const [source, setSource] = useState(undefined);
  const [fileError, setFileError] = useState(undefined);
  const videoJsOptions = {
    autoplay: true,
    controls: true,
    responsive: true,
    fluid: true,
    aspectRatio: "16:9",
    poster: vod.thumbnail_url,
    playsinline: true,
  };

  const onReady = (player) => {
    playerRef.current = player;

    player.hotkeys({
      alwaysCaptureHotkeys: true,
      volumeStep: 0.1,
      seekStep: 5,
      enableModifiersForNumbers: false,
      enableMute: true,
      enableFullscreen: true,
    });

    canAutoPlay.video().then(({ result }) => {
      if (!result) playerRef.current.muted(true);
    });

    player.on("play", () => {
      timeUpdate();
      loopTimeUpdate();
      setPlaying({ playing: true });
    });

    player.on("pause", () => {
      clearTimeUpdate();
      setPlaying({ playing: false });
    });

    player.on("end", () => {
      clearTimeUpdate();
      setPlaying({ playing: false });
    });
  };

  const timeUpdate = () => {
    if (!playerRef.current) return;
    if (playerRef.current.paused()) return;
    let currentTime = 0;
    currentTime += playerRef.current.currentTime();
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

  const fileChange = (evt) => {
    setFileError(false);
    const file = evt.target.files[0];
    if (file.type.split("/")[0] !== "video") {
      return setFileError("It has to be a valid video file!");
    }

    setSource({ src: URL.createObjectURL(file), type: file.type });
  };

  useEffect(() => {
    if (!source || !playerRef.current) return;
    playerRef.current.src(source);
    if (timestamp) playerRef.current.currentTime(timestamp);

    const set = async () => {
      let playerDuration = playerRef.current.duration();
      while (isNaN(playerDuration) || playerDuration === 0) {
        playerDuration = playerRef.current.duration();
        await sleep(100);
      }
      const vodDuration = toSeconds(vod.duration);
      const tmpDelay = vodDuration - playerDuration < 0 ? 0 : vodDuration - playerDuration;
      setDelay(tmpDelay);
    };

    set();
  }, [source, playerRef, timestamp, vod, setDelay]);

  return (
    <Box sx={{ 
      width: "100%", 
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#000"
    }}>
      {type === "manual" && !source && (
        <Paper sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", width: "100%", flexDirection: "column" }}>
          {fileError && <Alert severity="error">{fileError}</Alert>}
          <Box sx={{ mt: 1 }}>
            <Button variant="contained" component="label">
              Select Video
              <input type="file" hidden onChange={fileChange} accept="video/*,.mkv" />
            </Button>
          </Box>
        </Paper>
      )}
      <Box 
        sx={{ 
          visibility: !source ? "hidden" : "visible", 
          width: "100%", 
          height: "100%",
          maxHeight: "100%",
          display: "flex",
          alignItems: "center",
          "& .video-js": {
            width: "100% !important",
            height: "100% !important"
          }
        }}
      >
        <VideoJS options={videoJsOptions} onReady={onReady} />
      </Box>
    </Box>
  );
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
