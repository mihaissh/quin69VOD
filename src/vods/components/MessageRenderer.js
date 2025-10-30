import React, { memo, useMemo } from "react";
import { Box, Typography, Link } from "@mui/material";
import Twemoji from "react-twemoji";
import { TwitchEmote, TwitchEmoticon, SevenTVEmote, FFZEmote, BTTVEmote } from "./EmoteRenderer";

const URL_REGEX = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:[0-9]+)?(\/[^\s]*)?$/;
let messageCount = 0;

const MessageRenderer = memo(({ fragments, emotesMap }) => {
  const renderedFragments = useMemo(() => {
    if (!fragments) return null;

    const textFragments = [];
    for (let i = 0; i < fragments.length; i++) {
      const fragment = fragments[i];
      
      // Handle Twitch emote
      if (fragment.emote) {
        textFragments.push(<TwitchEmote key={`twitch-emote-${messageCount++}`} fragment={fragment} />);
        continue;
      }

      // Handle Twitch emoticon
      if (fragment.emoticon) {
        textFragments.push(<TwitchEmoticon key={`twitch-emoticon-${messageCount++}`} fragment={fragment} />);
        continue;
      }

      // Process text for custom emotes and URLs
      const textArray = fragment.text.split(" ");

      for (const text of textArray) {
        if (emotesMap) {
          const textLower = text.toLowerCase();
          
          // Check 7TV emotes
          const sevenTVEmote = emotesMap["7tv"]?.get(textLower);
          if (sevenTVEmote) {
            textFragments.push(<SevenTVEmote key={`7tv-${messageCount++}`} emote={sevenTVEmote} />);
            continue;
          }
          
          // Check FFZ emotes
          const ffzEmote = emotesMap.ffz?.get(textLower);
          if (ffzEmote) {
            textFragments.push(<FFZEmote key={`ffz-${messageCount++}`} emote={ffzEmote} />);
            continue;
          }
          
          // Check BTTV emotes
          const bttvEmote = emotesMap.bttv?.get(textLower);
          if (bttvEmote) {
            textFragments.push(<BTTVEmote key={`bttv-${messageCount++}`} emote={bttvEmote} />);
            continue;
          }
        }

        // Check if text is a URL
        if (URL_REGEX.test(text)) {
          const url = text.startsWith('http') ? text : `https://${text}`;
          textFragments.push(
            <Link
              key={`url-${messageCount++}`}
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
            <Twemoji key={`text-${messageCount++}`} noWrapper options={{ className: "twemoji" }}>
              <Typography variant="body1" display="inline">{`${text} `}</Typography>
            </Twemoji>
          );
        }
      }
    }

    return textFragments.length > 0 ? textFragments : null;
  }, [fragments, emotesMap]);

  if (!renderedFragments) return null;

  return <Box sx={{ display: "inline" }}>{renderedFragments}</Box>;
});

MessageRenderer.displayName = 'MessageRenderer';

export default MessageRenderer;

