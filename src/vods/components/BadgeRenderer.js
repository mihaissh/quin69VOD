import React, { memo, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import MessageTooltip from "./MessageTooltip";

let badgesCount = 0;

const BadgeRenderer = memo(({ textBadges, badges }) => {
  const badgeElements = useMemo(() => {
    if (!badges || !textBadges) return null;
    
    const badgeWrapper = [];
    const channelBadges = badges.channel;
    const globalBadges = badges.global;

    for (const textBadge of textBadges) {
      const badgeId = textBadge._id ?? textBadge.setID;
      const version = textBadge.version;

      // Check channel badges first
      if (channelBadges) {
        const badge = channelBadges.find((channelBadge) => channelBadge.set_id === badgeId);
        if (badge) {
          const badgeVersion = badge.versions.find((badgeVersion) => badgeVersion.id === version);
          if (badgeVersion) {
            badgeWrapper.push(
              <MessageTooltip
                key={`badge-${badgesCount++}`}
                title={
                  <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                    <img 
                      crossOrigin="anonymous" 
                      loading="lazy" 
                      decoding="async" 
                      style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }} 
                      src={badgeVersion.image_url_4x} 
                      alt="" 
                    />
                    <Typography display="block" variant="caption">{badgeId}</Typography>
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

      // Check global badges
      if (globalBadges) {
        const badge = globalBadges.find((globalBadge) => globalBadge.set_id === badgeId);
        if (badge) {
          const badgeVersion = badge.versions.find((badgeVersion) => badgeVersion.id === version);
          if (badgeVersion) {
            badgeWrapper.push(
              <MessageTooltip
                key={`badge-${badgesCount++}`}
                title={
                  <Box sx={{ maxWidth: "30rem", textAlign: "center" }}>
                    <img 
                      crossOrigin="anonymous" 
                      loading="lazy" 
                      decoding="async"
                      style={{ marginBottom: "0.3rem", border: "none", maxWidth: "100%", verticalAlign: "top" }} 
                      src={badgeVersion.image_url_4x} 
                      alt="" 
                    />
                    <Typography display="block" variant="caption">{badgeId}</Typography>
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
    }

    return badgeWrapper.length > 0 ? badgeWrapper : null;
  }, [textBadges, badges]);

  if (!badgeElements) return null;

  return <Box sx={{ display: "inline" }}>{badgeElements}</Box>;
});

BadgeRenderer.displayName = 'BadgeRenderer';

export default BadgeRenderer;