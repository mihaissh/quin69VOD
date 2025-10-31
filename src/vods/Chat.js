import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Tooltip, IconButton, Button, useMediaQuery } from "@mui/material";
import SimpleBar from "simplebar-react";
import Loading from "../utils/Loading";
import Settings from "./Settings";
import { Icon } from "@iconify/react";
import ChatHeader from "./components/ChatHeader";
import ChatMessage from "./components/ChatMessage";

const BASE_FFZ_EMOTE_API = "https://api.frankerfacez.com/v1";
const BASE_BTTV_EMOTE_API = "https://api.betterttv.net/3";
const BASE_7TV_EMOTE_API = "https://7tv.io/v3";
export default function Chat(props) {
  const { isPortrait, vodId, playerRef, playing, VODS_API_BASE, twitchId, userChatDelay, delay, youtube, part, games } = props;
  const [showChat, setShowChat] = useState(true);
  const isMobile = useMediaQuery("(max-width: 900px)");
  // Threshold to detect when user has scrolled away from bottom
  const BOTTOM_THRESHOLD = 100; // Show "Chat Paused" when scrolled up more than 100px
  
  // Reset chat to visible when switching to portrait
  useEffect(() => {
    if (isPortrait) {
      setShowChat(true);
    }
  }, [isPortrait]);
  const [shownMessages, setShownMessages] = useState([]);
  const comments = useRef([]);
  const badges = useRef();
  const emotes = useRef({ ffz_emotes: [], bttv_emotes: [], "7tv_emotes": [] });
  const emotesMap = useRef({ "7tv": new Map(), bttv: new Map(), ffz: new Map() });
  const cursor = useRef();
  const loopRef = useRef();
  const playRef = useRef();
  const chatRef = useRef();
  const autoScrollRef = useRef(true);
  const stoppedAtIndex = useRef(0);
  const [scrolling, setScrolling] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(() => {
    const saved = localStorage.getItem("chatShowTimestamp");
    return saved === "true";
  });
  const [alternativeBg, setAlternativeBg] = useState(() => {
    const saved = localStorage.getItem("chatAlternativeBg");
    return saved === "true";
  });
  const [showModal, setShowModal] = useState(false);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem("chatShowTimestamp", showTimestamp);
  }, [showTimestamp]);

  useEffect(() => {
    localStorage.setItem("chatAlternativeBg", alternativeBg);
  }, [alternativeBg]);

  const handleScroll = useCallback((e) => {
    const target = e.target;
    if (!target) return;
    
    const atBottom = target.scrollHeight - target.clientHeight - target.scrollTop < BOTTOM_THRESHOLD;
    setScrolling(!atBottom);
    autoScrollRef.current = atBottom;
  }, []);

  useEffect(() => {
    const buildEmotesMap = () => {
      emotesMap.current["7tv"].clear();
      emotesMap.current.bttv.clear();
      emotesMap.current.ffz.clear();
      
      if (emotes.current["7tv_emotes"]) {
        emotes.current["7tv_emotes"].forEach(emote => {
          if (emote.name) emotesMap.current["7tv"].set(emote.name.toLowerCase(), emote);
          if (emote.code) emotesMap.current["7tv"].set(emote.code.toLowerCase(), emote);
        });
      }
      
      if (emotes.current.bttv_emotes) {
        emotes.current.bttv_emotes.forEach(emote => {
          if (emote.name) emotesMap.current.bttv.set(emote.name.toLowerCase(), emote);
          if (emote.code) emotesMap.current.bttv.set(emote.code.toLowerCase(), emote);
        });
      }
      
      if (emotes.current.ffz_emotes) {
        emotes.current.ffz_emotes.forEach(emote => {
          if (emote.name) emotesMap.current.ffz.set(emote.name.toLowerCase(), emote);
          if (emote.code) emotesMap.current.ffz.set(emote.code.toLowerCase(), emote);
        });
      }
    };

    const loadBadges = () => {
      fetch(`${VODS_API_BASE}/v2/badges`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) return;
          badges.current = data;
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const loadEmotes = async () => {
      await fetch(`${VODS_API_BASE}/emotes?vod_id=${vodId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.data.length === 0) {
            loadBTTVGlobalEmotes();
            load7TVEmotes();
            loadFFZEmotes();
            return;
          }
          emotes.current = response.data[0];
          buildEmotesMap();
        })
        .catch((e) => {
          console.error(e);
          loadBTTVGlobalEmotes();
          load7TVEmotes();
          loadFFZEmotes();
        });
      load7TVGlobalEmotes();
    };

    const loadBTTVGlobalEmotes = () => {
      fetch(`${BASE_BTTV_EMOTE_API}/cached/emotes/global`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status >= 400) return;
          emotes.current.bttv_emotes = data;
          buildEmotesMap();
          loadBTTVChannelEmotes();
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const loadBTTVChannelEmotes = () => {
      fetch(`${BASE_BTTV_EMOTE_API}/cached/users/twitch/${twitchId}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status >= 400) return;
          emotes.current.bttv_emotes = emotes.current.bttv_emotes.concat(data.sharedEmotes.concat(data.channelEmotes));
          buildEmotesMap();
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const loadFFZEmotes = () => {
      fetch(`${BASE_FFZ_EMOTE_API}/room/id/${twitchId}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status >= 400) return;
          emotes.current.ffz_emotes = data.sets[data.room.set].emoticons;
          buildEmotesMap();
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const load7TVEmotes = () => {
      fetch(`${BASE_7TV_EMOTE_API}/users/twitch/${twitchId}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.status_code >= 400) return;
          emotes.current["7tv_emotes"] = data.emote_set.emotes;
          buildEmotesMap();
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const load7TVGlobalEmotes = () => {
      fetch(`${BASE_7TV_EMOTE_API}/emote-sets/global`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          emotes.current["7tv_emotes"] = emotes.current["7tv_emotes"].concat(data.emotes);
          buildEmotesMap();
        })
        .catch((e) => {
          console.error(e);
        });
    };

    loadEmotes();
    loadBadges();
  }, [vodId, VODS_API_BASE, twitchId]);

  const getCurrentTime = useCallback(() => {
    if (!playerRef.current) return 0;
    let time = 0;
    if (youtube) {
      for (let i = 0; i < youtube.length; i++) {
        let video = youtube[i];
        if (i + 1 >= part.part) break;
        time += video.duration;
      }
      time += playerRef.current.getCurrentTime();
    } else if (games) {
      time += parseFloat(games[part.part - 1].start_time);
      time += playerRef.current.getCurrentTime();
    } else {
      time += playerRef.current.currentTime();
    }
    time += delay;
    time += userChatDelay;
    return time;
  }, [playerRef, youtube, delay, part, userChatDelay, games]);

  const buildComments = useCallback(() => {
    if (!playerRef.current || !comments.current || comments.current.length === 0 || !cursor.current || stoppedAtIndex.current === null) return;
    if (youtube || games ? playerRef.current.getPlayerState() !== 1 : playerRef.current.paused()) return;

    const time = getCurrentTime();
    let lastIndex = comments.current.length - 1;
    for (let i = stoppedAtIndex.current; i < comments.current.length; i++) {
      if (comments.current[i].content_offset_seconds > time) {
        lastIndex = i;
        break;
      }
    }

    if (stoppedAtIndex.current === lastIndex && stoppedAtIndex.current !== 0) return;

    const fetchNextComments = () => {
      fetch(`${VODS_API_BASE}/v1/vods/${vodId}/comments?cursor=${cursor.current}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          stoppedAtIndex.current = 0;
          comments.current = response.comments;
          cursor.current = response.cursor;
        })
        .catch((e) => {
          console.error(e);
        });
    };

    // Build messages array - memoization happens at component level for rendered messages
    const messages = [];
    for (let i = stoppedAtIndex.current; i < lastIndex; i++) {
      const comment = comments.current[i];
      if (!comment.message) continue;
      messages.push(
        <ChatMessage
          key={comment.id}
          comment={comment}
          showTimestamp={showTimestamp}
          badges={badges.current}
          emotesMap={emotesMap.current}
        />
      );
    }

    setShownMessages((shownMessages) => {
      const concatMessages = shownMessages.concat(messages);
      if (concatMessages.length > 200) concatMessages.splice(0, messages.length);

      return concatMessages;
    });
    stoppedAtIndex.current = lastIndex;
    if (comments.current.length - 1 === lastIndex) fetchNextComments();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentTime, playerRef, vodId, VODS_API_BASE, youtube, games, showTimestamp, alternativeBg]);

  const loop = useCallback(() => {
    if (loopRef.current !== null) clearInterval(loopRef.current);
    buildComments();
    loopRef.current = setInterval(buildComments, 1000);
  }, [buildComments]);

  useEffect(() => {
    if (!playing.playing || stoppedAtIndex.current === undefined) return;
    const fetchComments = (offset = 0) => {
      fetch(`${VODS_API_BASE}/v1/vods/${vodId}/comments?content_offset_seconds=${offset}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((response) => {
          comments.current = response.comments;
          cursor.current = response.cursor;
        })
        .catch((e) => {
          console.error(e);
        });
    };

    const time = getCurrentTime();

    if (comments.current && comments.current.length > 0) {
      const lastComment = comments.current[comments.current.length - 1];
      const firstComment = comments.current[0];

      if (time - lastComment.content_offset_seconds <= 30 && time > firstComment.content_offset_seconds) {
        if (comments.current[stoppedAtIndex.current].content_offset_seconds - time >= 4) {
          stoppedAtIndex.current = 0;
          setShownMessages([]);
        }
        loop();
        return;
      }
    }
    if (playRef.current) clearTimeout(playRef.current);
    playRef.current = setTimeout(() => {
      stopLoop();
      stoppedAtIndex.current = 0;
      comments.current = [];
      cursor.current = null;
      setShownMessages([]);
      fetchComments(time);
      loop();
    }, 300);
    return () => {
      stopLoop();
    };
  }, [playing, vodId, getCurrentTime, loop, VODS_API_BASE]);

  const stopLoop = () => {
    if (loopRef.current !== null) clearInterval(loopRef.current);
  };

  useEffect(() => {
    if (!chatRef.current || shownMessages.length === 0) return;

    if (autoScrollRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [shownMessages]);

  const scrollToBottom = () => {
    autoScrollRef.current = true;
    setScrolling(false);
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  const handleExpandClick = () => {
    setShowChat(!showChat);
  };

  return (
    <>
      {/* Hidden Chat - Floating Button */}
      {!showChat && !isPortrait && (
        <Box 
          sx={{ 
            position: "fixed",
            zIndex: 1000,
            right: { xs: 24, sm: 24, md: 24 }, // Moved left (higher right value)
            // Position below navbar: navbar height (64px on md) + more spacing to appear inside video
            // On mobile VOD pages navbar is hidden, so top is just spacing
            top: { xs: 16, sm: 16, md: 88 }, // 64px navbar + 24px spacing on desktop to appear inside video
          }}
        >
          <Tooltip title="Show Chat" placement="left">
            <IconButton 
              onClick={handleExpandClick}
              size="medium"
              sx={{
                transition: "all 0.2s ease-in-out",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.85)",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
                }
              }}
            >
              <Icon icon="mdi:chevron-left" width={22} style={{ color: "#fff" }} />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      
      {/* Chat Panel */}
      <Box 
        sx={{ 
          height: isPortrait ? "auto" : "100%",
          background: "#131314", 
          display: showChat ? "flex" : "none",
          flexDirection: "column", 
          minHeight: isPortrait ? "300px" : 0,
          flex: isPortrait ? "1 1 auto" : "0 0 auto",
          width: isPortrait ? "100%" : "340px",
          minWidth: isPortrait ? "100%" : "340px",
          maxWidth: isPortrait ? "100%" : "340px",
          overflow: "hidden",
          position: "relative",
        }}
      >
          {/* Chat Header */}
          <ChatHeader 
            isPortrait={isPortrait}
            onToggleChat={handleExpandClick}
            onOpenSettings={() => setShowModal(true)}
          />

          {/* Chat Messages */}
          <Box sx={{ flex: 1, minHeight: 0, position: "relative", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {comments.current.length === 0 ? (
              <Box sx={{ 
                height: "100%", 
                width: "100%", 
                display: "flex", 
                flexDirection: "column", 
                minHeight: 0, 
                flex: 1,
                overflow: "hidden",
              }}>
                <Loading />
              </Box>
            ) : (
              <>
                <SimpleBar 
                  scrollableNodeProps={{ ref: chatRef, onScroll: handleScroll }} 
                  style={{ 
                    height: "100%", 
                    overflowX: "hidden",
                    flex: 1
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "flex-end", flexDirection: "column", minHeight: "100%" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0, pb: 1.5 }} className="chat-list" data-alt-bg={alternativeBg ? "true" : "false"}>
                      {shownMessages}
                      {/* spacer to avoid bottom clipping */}
                      <Box sx={{ height: 8 }} />
                    </Box>
                  </Box>
                </SimpleBar>
                
                {/* Scroll to Bottom Button */}
                {scrolling && (
                  <Box 
                    sx={{ 
                      position: "absolute", 
                      bottom: 8,
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10
                    }}
                  >
                    <Button 
                      size="small" 
                      onClick={scrollToBottom}
                      variant="contained"
                      startIcon={<Icon icon="mdi:pause" width={16} style={{ color: "#fff" }} />}
                      sx={{
                        backgroundColor: "#2A2A2A",
                        color: "#fff",
                        borderRadius: "8px",
                        textTransform: "none",
                        fontWeight: 500,
                        boxShadow: "none",
                        px: 2,
                        py: 1,
                        minWidth: "auto",
                        "&:hover": {
                          backgroundColor: "#353535",
                          boxShadow: "none",
                        },
                        "& .MuiButton-startIcon": {
                          marginRight: 1,
                          marginLeft: 0,
                        }
                      }}
                    >
                      Chat Paused
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
      </Box>
      
      {/* Settings Modal */}
      <Settings
        userChatDelay={userChatDelay}
        setUserChatDelay={props.setUserChatDelay}
        showModal={showModal}
        setShowModal={setShowModal}
        showTimestamp={showTimestamp}
        setShowTimestamp={setShowTimestamp}
        alternativeBg={alternativeBg}
        setAlternativeBg={setAlternativeBg}
      />
    </>
  );
}