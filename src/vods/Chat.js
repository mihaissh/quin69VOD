import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Typography, Tooltip, styled, IconButton, Button, tooltipClasses, Link } from "@mui/material";
import SimpleBar from "simplebar-react";
import Loading from "../utils/Loading";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Twemoji from "react-twemoji";
import Settings from "./Settings";
import { toHHMMSS } from "../utils/helpers";
import SettingsIcon from "@mui/icons-material/Settings";

const BASE_TWITCH_CDN = "https://static-cdn.jtvnw.net";
const BASE_FFZ_EMOTE_CDN = "https://cdn.frankerfacez.com/emote";
//Needs CORS for mobile devices.
const BASE_BTTV_EMOTE_CDN = "https://emotes.overpowered.tv/bttv";
const BASE_7TV_EMOTE_CDN = "https://cdn.7tv.app/emote";
const BASE_FFZ_EMOTE_API = "https://api.frankerfacez.com/v1";
const BASE_BTTV_EMOTE_API = "https://api.betterttv.net/3";
const BASE_7TV_EMOTE_API = "https://7tv.io/v3";

// URL detection regex
const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]+)?(\/[^\s]*)?$/;

let messageCount = 0;
let badgesCount = 0;

export default function Chat(props) {
  const { isPortrait, vodId, playerRef, playing, VODS_API_BASE, twitchId, channel, userChatDelay, delay, youtube, part, games } = props;
  const [showChat, setShowChat] = useState(true);
  
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
  const cursor = useRef();
  const loopRef = useRef();
  const playRef = useRef();
  const chatRef = useRef();
  const stoppedAtIndex = useRef(0);
  const newMessages = useRef();
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

  useEffect(() => {
    if (chatRef && chatRef.current) {
      const ref = chatRef.current;
      const handleScroll = (e) => {
        e.stopPropagation();
        const atBottom = ref.scrollHeight - ref.clientHeight - ref.scrollTop < 512;
        setScrolling(!atBottom);
      };

      ref.addEventListener("scroll", handleScroll);

      return () => ref.removeEventListener("scroll", handleScroll);
    }
  });

  useEffect(() => {
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
        })
        .catch((e) => {
          console.error(e);
        });
    };

    loadEmotes();
    loadBadges();
  }, [vodId, VODS_API_BASE, twitchId, channel]);

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
    const currentShownMessagesLength = shownMessages.length;
    for (let i = stoppedAtIndex.current.valueOf(); i < comments.current.length; i++) {
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

    const transformBadges = (textBadges) => {
      const badgeWrapper = [];
      if (!badges.current) return;
      const channelBadges = badges.current.channel;
      const globalBadges = badges.current.global;

      for (const textBadge of textBadges) {
        const badgeId = textBadge._id ?? textBadge.setID;
        const version = textBadge.version;

        if (channelBadges) {
          const badge = channelBadges.find((channelBadge) => channelBadge.set_id === badgeId);
          if (badge) {
            const badgeVersion = badge.versions.find((badgeVersion) => badgeVersion.id === version);
            if (badgeVersion) {
              badgeWrapper.push(
                <MessageTooltip
                  key={badgesCount++}
                  title={
                    <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                      <img crossOrigin="anonymous" loading="lazy" decoding="async" style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }} src={badgeVersion.image_url_4x} alt="" />
                      <Typography display="block" variant="caption">{`${badgeId}`}</Typography>
                    </Box>
                  }
                >
                  <img
                    crossOrigin="anonymous"
                    loading="lazy"
                    decoding="async"
                    style={{ display: "inline-block", minWidth: "1rem", height: "1rem", margin: "0 .2rem .1rem 0", backgroundPosition: "50%", verticalAlign: "middle" }}
                    srcSet={`${badgeVersion.image_url_1x} 1x, ${badgeVersion.image_url_2x} 2x, ${badgeVersion.image_url_4x} 4x`}
                    src={badgeVersion.image_url_1x}
                    alt=""
                  />
                </MessageTooltip>
              );
              continue;
            }
          }
        }

        if (globalBadges) {
          const badge = globalBadges.find((globalBadge) => globalBadge.set_id === badgeId);
          if (badge) {
            const badgeVersion = badge.versions.find((badgeVersion) => badgeVersion.id === version);
            badgeWrapper.push(
              <MessageTooltip
                key={badgesCount++}
                title={
                  <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                    <img crossOrigin="anonymous" style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }} src={badgeVersion.image_url_4x} alt="" />
                    <Typography display="block" variant="caption">{`${badgeId}`}</Typography>
                  </Box>
                }
              >
                <img
                  crossOrigin="anonymous"
                  style={{ display: "inline-block", minWidth: "1rem", height: "1rem", margin: "0 .2rem .1rem 0", backgroundPosition: "50%", verticalAlign: "middle" }}
                  srcSet={`${badgeVersion.image_url_1x} 1x, ${badgeVersion.image_url_2x} 2x, ${badgeVersion.image_url_4x} 4x`}
                  src={badgeVersion.image_url_1x}
                  alt=""
                />
              </MessageTooltip>
            );
            continue;
          }
        }
      }

      return <Box sx={{ display: "inline" }}>{badgeWrapper}</Box>;
    };

    const transformMessage = (fragments) => {
      if (!fragments) return;

      const textFragments = [];
      for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        if (fragment.emote) {
          textFragments.push(
            <MessageTooltip
              key={messageCount++}
              title={
                <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                  <img
                    crossOrigin="anonymous"
                    style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }}
                    src={`${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emote.emoteID}/default/dark/3.0`}
                    alt=""
                  />
                  <Typography display="block" variant="caption">{`Emote: ${fragment.text}`}</Typography>
                  <Typography display="block" variant="caption">
                    {`Twitch Emotes`}
                  </Typography>
                </Box>
              }
            >
              <Box sx={{ display: "inline" }}>
                <img
                  crossOrigin="anonymous"
                  style={{ verticalAlign: "middle", border: "none", maxWidth: "100%" }}
                  src={`${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emote.emoteID}/default/dark/1.0`}
                  srcSet={`${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emote.emoteID}/default/dark/1.0 1x, ${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emote.emoteID}/default/dark/2.0 2x, ${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emote.emoteID}/default/dark/3.0 4x`}
                  alt=""
                />{" "}
              </Box>
            </MessageTooltip>
          );
          continue;
        }

        if (fragment.emoticon) {
          textFragments.push(
            <MessageTooltip
              key={messageCount++}
              title={
                <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                  <img
                    crossOrigin="anonymous"
                    style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }}
                    src={`${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emoticon.emoticon_id}/default/dark/3.0`}
                    alt=""
                  />
                  <Typography display="block" variant="caption">{`Emote: ${fragment.text}`}</Typography>
                  <Typography display="block" variant="caption">
                    {`Twitch Emotes`}
                  </Typography>
                </Box>
              }
            >
              <Box sx={{ display: "inline" }}>
                <img
                  crossOrigin="anonymous"
                  style={{ verticalAlign: "middle", border: "none", maxWidth: "100%" }}
                  src={`${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emoticon.emoticon_id}/default/dark/1.0`}
                  srcSet={`${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emoticon.emoticon_id}/default/dark/1.0 1x, ${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emoticon.emoticon_id}/default/dark/2.0 2x, ${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emoticon.emoticon_id}/default/dark/3.0 4x`}
                  alt=""
                />{" "}
              </Box>
            </MessageTooltip>
          );
          continue;
        }

        let textArray = fragment.text.split(" ");

        for (let text of textArray) {
          if (emotes.current) {
            const SEVENTV_EMOTES = emotes.current["7tv_emotes"];
            const BTTV_EMOTES = emotes.current["bttv_emotes"];
            const FFZ_EMOTES = emotes.current["ffz_emotes"];

            if (SEVENTV_EMOTES) {
              const emote = SEVENTV_EMOTES.find((SEVENTV_EMOTE) => SEVENTV_EMOTE.name === text || SEVENTV_EMOTE.code === text);
              if (emote) {
                textFragments.push(
                  <MessageTooltip
                    key={messageCount++}
                    title={
                      <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                        <img
                          crossOrigin="anonymous"
                          style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }}
                          src={`${BASE_7TV_EMOTE_CDN}/${emote.id}/4x.webp`}
                          alt=""
                        />
                        <Typography display="block" variant="caption">{`Emote: ${emote.name || emote.code}`}</Typography>
                        <Typography display="block" variant="caption">
                          7TV Emotes
                        </Typography>
                      </Box>
                    }
                  >
                    <Box sx={{ display: "inline" }}>
                      <img
                        crossOrigin="anonymous"
                        style={{ verticalAlign: "middle", border: "none", maxWidth: "100%" }}
                        src={`${BASE_7TV_EMOTE_CDN}/${emote.id}/1x.webp`}
                        srcSet={`${BASE_7TV_EMOTE_CDN}/${emote.id}/1x.webp 1x, ${BASE_7TV_EMOTE_CDN}/${emote.id}/2x.webp 2x, ${BASE_7TV_EMOTE_CDN}/${emote.id}/3x.webp 3x, ${BASE_7TV_EMOTE_CDN}/${emote.id}/4x.webp 4x`}
                        alt=""
                      />{" "}
                    </Box>
                  </MessageTooltip>
                );
                continue;
              }
            }

            if (FFZ_EMOTES) {
              const emote = FFZ_EMOTES.find((FFZ_EMOTE) => FFZ_EMOTE.name === text || FFZ_EMOTE.code === text);
              if (emote) {
                textFragments.push(
                  <MessageTooltip
                    key={messageCount++}
                    title={
                      <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                        <img crossOrigin="anonymous" loading="lazy" decoding="async" style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }} src={`${BASE_FFZ_EMOTE_CDN}/${emote.id}/4`} alt="" />
                        <Typography display="block" variant="caption">{`Emote: ${emote.name || emote.code}`}</Typography>
                        <Typography display="block" variant="caption">
                          FFZ Emotes
                        </Typography>
                      </Box>
                    }
                  >
                    <Box key={messageCount++} style={{ display: "inline" }}>
                      <img
                        crossOrigin="anonymous"
                        style={{ verticalAlign: "middle", border: "none", maxWidth: "100%" }}
                        src={`${BASE_FFZ_EMOTE_CDN}/${emote.id}/1`}
                        srcSet={`${BASE_FFZ_EMOTE_CDN}/${emote.id}/1 1x, ${BASE_FFZ_EMOTE_CDN}/${emote.id}/2 2x, ${BASE_FFZ_EMOTE_CDN}/${emote.id}/4 4x`}
                        alt=""
                      />{" "}
                    </Box>
                  </MessageTooltip>
                );
                continue;
              }
            }

            if (BTTV_EMOTES) {
              const emote = BTTV_EMOTES.find((BTTV_EMOTE) => BTTV_EMOTE.name === text || BTTV_EMOTE.code === text);
              if (emote) {
                textFragments.push(
                  <MessageTooltip
                    key={messageCount++}
                    title={
                      <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                        <img crossOrigin="anonymous" loading="lazy" decoding="async" style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }} src={`${BASE_BTTV_EMOTE_CDN}/${emote.id}/3x`} alt="" />
                        <Typography display="block" variant="caption">{`Emote: ${emote.name || emote.code}`}</Typography>
                        <Typography display="block" variant="caption">
                          BTTV Emotes
                        </Typography>
                      </Box>
                    }
                  >
                    <Box key={messageCount++} style={{ display: "inline" }}>
                      <img
                        crossOrigin="anonymous"
                        style={{ verticalAlign: "middle", border: "none", maxWidth: "100%" }}
                        src={`${BASE_BTTV_EMOTE_CDN}/${emote.id}/1x`}
                        srcSet={`${BASE_BTTV_EMOTE_CDN}/${emote.id}/1x 1x, ${BASE_BTTV_EMOTE_CDN}/${emote.id}/2x 2x, ${BASE_BTTV_EMOTE_CDN}/${emote.id}/3x 3x`}
                        alt=""
                      />{" "}
                    </Box>
                  </MessageTooltip>
                );
                continue;
              }
            }
          }

          // Check if text is a URL
          if (URL_REGEX.test(text)) {
            const url = text.startsWith('http') ? text : `https://${text}`;
            textFragments.push(
              <Link
                key={messageCount++}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#8B5CF6",
                  textDecoration: "none",
                  display: "inline",
                  "&:hover": {
                    textDecoration: "underline",
                    color: "#A78BFA"
                  },
                  wordBreak: "break-all"
                }}
              >
                {text}{" "}
              </Link>
            );
          } else {
            textFragments.push(
              <Twemoji key={messageCount++} noWrapper options={{ className: "twemoji" }}>
                <Typography variant="body1" display="inline">{`${text} `}</Typography>
              </Twemoji>
            );
          }
        }
      }
      return <Box sx={{ display: "inline" }}>{textFragments}</Box>;
    };

    const messages = [];
    for (let i = stoppedAtIndex.current.valueOf(); i < lastIndex; i++) {
      const comment = comments.current[i];
      if (!comment.message) continue;
      const messageIndex = currentShownMessagesLength + messages.length;
      messages.push(
        <Box 
          key={comment.id} 
          sx={{ 
            width: "100%",
            backgroundColor: alternativeBg && messageIndex % 2 === 1 ? "rgba(255, 255, 255, 0.03)" : "transparent",
            transition: "background-color 0.2s ease-in-out"
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
                {comment.user_badges && transformBadges(comment.user_badges)}
                <Box sx={{ textDecoration: "none", display: "inline" }}>
                  <span style={{ color: comment.user_color, fontWeight: 600 }}>{comment.display_name}</span>
                </Box>
                <Box sx={{ display: "inline" }}>
                  <span>: </span>
                  {transformMessage(comment.message)}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      );
    }

    newMessages.current = messages;

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

    const atBottom = chatRef.current.scrollHeight - chatRef.current.clientHeight - chatRef.current.scrollTop < 512;
    if (atBottom) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [shownMessages]);

  const scrollToBottom = () => {
    setScrolling(false);
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
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
            right: 16,
            top: 16,
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
              <ChevronLeftIcon sx={{ color: "#fff" }} />
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
                    onClick={handleExpandClick} 
                    size="small"
                    sx={{
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }
                    }}
                  >
                    <ChevronRightIcon />
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
                  onClick={() => setShowModal(true)} 
                  size="small"
                  sx={{
                    transition: "all 0.2s ease-in-out",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                    }
                  }}
                >
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Chat Messages */}
          <Box sx={{ flex: 1, minHeight: 0, position: "relative", display: "flex", flexDirection: "column" }}>
            {comments.length === 0 ? (
              <Loading />
            ) : (
              <>
                <SimpleBar 
                  scrollableNodeProps={{ ref: chatRef }} 
                  style={{ 
                    height: "100%", 
                    overflowX: "hidden",
                    flex: 1
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "flex-end", flexDirection: "column", minHeight: "100%" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
                      {shownMessages}
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
                      sx={{
                        background: "rgba(0, 0, 0, 0.85)",
                        backdropFilter: "blur(8px)",
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
                        "&:hover": {
                          background: "rgba(0, 0, 0, 0.95)",
                        }
                      }}
                    >
                      Resume Chat
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


const MessageTooltip = styled(({ className, ...props }) => <Tooltip {...props} PopperProps={{ disablePortal: true }} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#fff",
    color: "rgba(0, 0, 0, 0.87)",
  },
}));
