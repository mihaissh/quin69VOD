import { useEffect, useState, useRef } from "react";
import { Box, Typography, MenuItem, Tooltip, useMediaQuery, FormControl, InputLabel, Select, Collapse, Divider } from "@mui/material";
import Loading from "../utils/Loading";
import { useLocation, useParams } from "react-router-dom";
import YoutubePlayer from "./Youtube";
import { Icon } from "@iconify/react";
import NotFound from "../utils/NotFound";
import Chat from "../vods/Chat";
import ExpandMore from "../utils/CustomExpandMore";
import CustomToolTip from "../utils/CustomToolTip";

const delay = 0;

export default function Games(props) {
  const { VODS_API_BASE, channel, twitchId } = props;
  const location = useLocation();
  const isPortrait = useMediaQuery("(orientation: portrait)");
  const isMobile = useMediaQuery("(max-width: 900px)");
  const { vodId } = useParams();
  const [vod, setVod] = useState(undefined);
  const [games, setGames] = useState(undefined);
  const [drive, setDrive] = useState(undefined);
  const [part, setPart] = useState(undefined);
  const [showMenu, setShowMenu] = useState(true);
  const [playing, setPlaying] = useState({ playing: false });
  const [currentTime, setCurrentTime] = useState(undefined);
  const [userChatDelay, setUserChatDelay] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    const fetchVod = async () => {
      await fetch(`${VODS_API_BASE}/vods/${vodId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          setVod(response);
          document.title = `${response.id} - ${channel}`;
        })
        .catch((e) => {
          console.error(e);
        });
    };
    fetchVod();
  }, [vodId, VODS_API_BASE, channel]);

  useEffect(() => {
    if (!vod) return;
    setDrive(vod.drive.filter((data) => data.type === "vod"));
    setGames(vod.games);
    const search = new URLSearchParams(location.search);
    const game_id = search.get("game_id") !== null ? parseInt(search.get("game_id")) : undefined;
    const index = vod.games.findIndex((game) => parseInt(game.id) === game_id);
    setPart({ part: index === -1 ? 1 : index + 1, timestamp: 0 });
  }, [vod, location.search]);

  const handlePartChange = (evt) => {
    const tmpPart = evt.target.value + 1;
    setPart({ part: tmpPart, timestamp: 0 });
  };

  const handleExpandClick = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`Chat Delay: ${userChatDelay + delay} seconds`);
    }
  }, [userChatDelay]);

  if (vod === undefined || drive === undefined || part === undefined || delay === undefined) return <Loading />;

  if (games.length === 0) return <NotFound />;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", backgroundColor: "#0E0E10", pb: 1, boxSizing: "border-box", overflow: "hidden" }}>
      <Box sx={{ 
        display: "flex", 
        flexDirection: isPortrait ? "column" : "row", 
        flex: 1, 
        minHeight: 0,
        p: isMobile ? 0 : 2,
        gap: isMobile ? 0 : 2,
      }}>
        <Box sx={{ 
          display: "flex", 
          flex: isPortrait ? "0 0 auto" : "1 1 auto",
          height: isPortrait ? "auto" : "100%", 
          flexDirection: "column", 
          alignItems: "flex-start", 
          minWidth: 0, 
          overflow: "hidden", 
          position: "relative",
          backgroundColor: "#000",
          borderRadius: isMobile ? 0 : 1,
        }}>
          <Box sx={{ 
            width: "100%",
            aspectRatio: isPortrait ? "16/9" : "auto",
            height: isPortrait ? "auto" : "100%",
            maxHeight: isPortrait ? "56.25vw" : "none",
            position: "relative"
          }}>
            <YoutubePlayer playerRef={playerRef} part={part} games={games} setPart={setPart} setPlaying={setPlaying} setCurrentTime={setCurrentTime} delay={delay} />
          </Box>
          {!showMenu && (
            <Box sx={{ position: "absolute", bottom: 8, right: 8 }}>
              <Tooltip title={showMenu ? "Collapse" : "Expand"}>
                <ExpandMore expand={showMenu} onClick={handleExpandClick} aria-expanded={showMenu} aria-label="show menu">
                  <Icon icon="mdi:chevron-down" width={24} />
                </ExpandMore>
              </Tooltip>
            </Box>
          )}
          <Collapse in={showMenu} timeout="auto" unmountOnExit sx={{ minHeight: "auto !important", width: "100%" }}>
            <Box sx={{ display: "flex", p: 1, alignItems: "center", gap: 1 }}>
              <CustomToolTip title={vod.title}>
                <Typography fontWeight={550} variant="body1" noWrap={true} sx={{ flex: 1, minWidth: 0 }}>{`${vod.title}`}</Typography>
              </CustomToolTip>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {games.length > 1 && (
                  <FormControl variant="outlined" size="small">
                    <InputLabel id="select-label">Game</InputLabel>
                    <Select labelId="select-label" label="Game" value={part.part - 1} onChange={handlePartChange} autoWidth>
                      {games.map((data, i) => {
                        return (
                          <MenuItem key={data.id} value={i}>
                            {data.title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                )}
              </Box>
              <Tooltip title={showMenu ? "Collapse" : "Expand"}>
                <ExpandMore expand={showMenu} onClick={handleExpandClick} aria-expanded={showMenu} aria-label="show menu">
                  <Icon icon="mdi:chevron-down" width={24} />
                </ExpandMore>
              </Tooltip>
            </Box>
          </Collapse>
        </Box>
        {isPortrait && <Divider />}
        <Chat
          isPortrait={isPortrait}
          vodId={vodId}
          playerRef={playerRef}
          playing={playing}
          currentTime={currentTime}
          delay={delay}
          userChatDelay={userChatDelay}
          part={part}
          setPart={setPart}
          games={games}
          setUserChatDelay={setUserChatDelay}
          channel={channel}
          twitchId={twitchId}
          VODS_API_BASE={VODS_API_BASE}
        />
      </Box>
    </Box>
  );
}
