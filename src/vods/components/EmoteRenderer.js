import React, { memo } from "react";
import { Box, Typography } from "@mui/material";
import MessageTooltip from "./MessageTooltip";

const BASE_TWITCH_CDN = "https://static-cdn.jtvnw.net";
const BASE_FFZ_EMOTE_CDN = "https://cdn.frankerfacez.com/emote";
const BASE_BTTV_EMOTE_CDN = "https://emotes.overpowered.tv/bttv";
const BASE_7TV_EMOTE_CDN = "https://cdn.7tv.app/emote";

let messageCount = 0;

const TwitchEmote = memo(({ fragment }) => (
  <MessageTooltip
    key={`emote-${messageCount++}`}
    title={
      <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
        <img
          crossOrigin="anonymous"
          style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }}
          src={`${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emote.emoteID}/default/dark/3.0`}
          alt=""
        />
        <Typography display="block" variant="caption">Emote: {fragment.text}</Typography>
        <Typography display="block" variant="caption">Twitch Emotes</Typography>
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
));

TwitchEmote.displayName = 'TwitchEmote';

const TwitchEmoticon = memo(({ fragment }) => (
  <MessageTooltip
    key={`emoticon-${messageCount++}`}
    title={
      <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
        <img
          crossOrigin="anonymous"
          style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }}
          src={`${BASE_TWITCH_CDN}/emoticons/v2/${fragment.emoticon.emoticon_id}/default/dark/3.0`}
          alt=""
        />
        <Typography display="block" variant="caption">Emote: {fragment.text}</Typography>
        <Typography display="block" variant="caption">Twitch Emotes</Typography>
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
));

TwitchEmoticon.displayName = 'TwitchEmoticon';

const SevenTVEmote = memo(({ emote }) => (
  <MessageTooltip
    key={`7tv-${messageCount++}`}
    title={
      <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
        <img
          crossOrigin="anonymous"
          style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }}
          src={`${BASE_7TV_EMOTE_CDN}/${emote.id}/4x.webp`}
          alt=""
        />
        <Typography display="block" variant="caption">Emote: {emote.name || emote.code}</Typography>
        <Typography display="block" variant="caption">7TV Emotes</Typography>
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
));

SevenTVEmote.displayName = 'SevenTVEmote';

const FFZEmote = memo(({ emote }) => (
  <MessageTooltip
    key={`ffz-${messageCount++}`}
    title={
      <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
        <img 
          crossOrigin="anonymous" 
          loading="lazy" 
          decoding="async" 
          style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }} 
          src={`${BASE_FFZ_EMOTE_CDN}/${emote.id}/4`} 
          alt="" 
        />
        <Typography display="block" variant="caption">Emote: {emote.name || emote.code}</Typography>
        <Typography display="block" variant="caption">FFZ Emotes</Typography>
      </Box>
    }
  >
    <Box key={`ffz-box-${messageCount++}`} style={{ display: "inline" }}>
      <img
        crossOrigin="anonymous"
        style={{ verticalAlign: "middle", border: "none", maxWidth: "100%" }}
        src={`${BASE_FFZ_EMOTE_CDN}/${emote.id}/1`}
        srcSet={`${BASE_FFZ_EMOTE_CDN}/${emote.id}/1 1x, ${BASE_FFZ_EMOTE_CDN}/${emote.id}/2 2x, ${BASE_FFZ_EMOTE_CDN}/${emote.id}/4 4x`}
        alt=""
      />{" "}
    </Box>
  </MessageTooltip>
));

FFZEmote.displayName = 'FFZEmote';

const BTTVEmote = memo(({ emote }) => (
  <MessageTooltip
    key={`bttv-${messageCount++}`}
    title={
      <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
        <img 
          crossOrigin="anonymous" 
          loading="lazy" 
          decoding="async" 
          style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }} 
          src={`${BASE_BTTV_EMOTE_CDN}/${emote.id}/3x`} 
          alt="" 
        />
        <Typography display="block" variant="caption">Emote: {emote.name || emote.code}</Typography>
        <Typography display="block" variant="caption">BTTV Emotes</Typography>
      </Box>
    }
  >
    <Box key={`bttv-box-${messageCount++}`} style={{ display: "inline" }}>
      <img
        crossOrigin="anonymous"
        style={{ verticalAlign: "middle", border: "none", maxWidth: "100%" }}
        src={`${BASE_BTTV_EMOTE_CDN}/${emote.id}/1x`}
        srcSet={`${BASE_BTTV_EMOTE_CDN}/${emote.id}/1x 1x, ${BASE_BTTV_EMOTE_CDN}/${emote.id}/2x 2x, ${BASE_BTTV_EMOTE_CDN}/${emote.id}/3x 3x`}
        alt=""
      />{" "}
    </Box>
  </MessageTooltip>
));

BTTVEmote.displayName = 'BTTVEmote';

export { TwitchEmote, TwitchEmoticon, SevenTVEmote, FFZEmote, BTTVEmote };

